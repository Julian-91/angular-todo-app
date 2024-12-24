import { Octokit } from '@octokit/rest';
import Anthropic from '@anthropic-ai/sdk';

class EfficientReviewBot {
    private octokit: Octokit;
    private anthropic: Anthropic;
    private MIN_CHANGES = 5; // Minimum number of changes for review

    constructor(githubToken: string, anthropicKey: string) {
        this.octokit = new Octokit({ auth: githubToken });
        this.anthropic = new Anthropic({ apiKey: anthropicKey });
    }

    private cleanDiff(patch: string): string {
        // Remove excessive context lines
        const lines = patch.split('\n');
        const relevantLines = lines.filter(line =>
            line.startsWith('+') ||
            line.startsWith('-') ||
            line.startsWith('@@')
        );

        // Maximum of 3 context lines per change
        return this.limitContext(relevantLines.join('\n'), 3);
    }

    private limitContext(diff: string, contextLines: number): string {
        const sections = diff.split('@@');
        return sections
            .map(section => {
                const lines = section.split('\n');
                const changes = lines.filter(l => l.startsWith('+') || l.startsWith('-'));
                const context = lines
                    .filter(l => !l.startsWith('+') && !l.startsWith('-'))
                    .slice(0, contextLines);
                return [...context, ...changes].join('\n');
            })
            .join('\n');
    }

    private shouldReviewFile(filename: string, additions: number, deletions: number): boolean {
        // Skip minor changes
        if (additions + deletions < this.MIN_CHANGES) return false;

        // Skip test files and configuration
        if (filename.includes('test') || filename.includes('config')) return false;

        const supportedExtensions = ['.ts', '.js', '.tsx', '.jsx', '.java'];
        return supportedExtensions.some(ext => filename.endsWith(ext));
    }

    async analyzeChanges(diff: string, filename: string): Promise<string> {
        try {
            const message = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                temperature: 0,
                system: "You are a senior software developer performing code reviews. Focus only on critical issues. Be concise and direct.",
                messages: [{
                    role: 'user',
                    content: `Review these code changes. Focus only on critical issues:
- Security issues
- Performance problems
- Major bugs
- Critical design flaws

File: ${filename}
Changes:
${diff}

Provide ONLY critical feedback in bullet points. Be brief and concise.`
                }]
            });

            return message.content[0].text;
        } catch (error) {
            console.error('Error analyzing changes:', error);
            throw error;
        }
    }

    async reviewPullRequest(owner: string, repo: string, prNumber: number): Promise<void> {
        try {
            const { data: files } = await this.octokit.pulls.listFiles({
                owner,
                repo,
                pull_number: prNumber,
            });

            const significantChanges = files.filter(file =>
                this.shouldReviewFile(file.filename, file.additions, file.deletions)
            );

            if (significantChanges.length === 0) {
                console.log('No significant changes found that require review');
                return;
            }

            const reviews: string[] = [];

            for (const file of significantChanges) {
                if (!file.patch) continue;

                const cleanedDiff = this.cleanDiff(file.patch);
                const feedback = await this.analyzeChanges(cleanedDiff, file.filename);

                if (feedback.trim()) {
                    reviews.push(`### ${file.filename}\n${feedback}`);
                }
            }

            if (reviews.length > 0) {
                await this.octokit.pulls.createReview({
                    owner,
                    repo,
                    pull_number: prNumber,
                    event: 'COMMENT',
                    body: reviews.join('\n\n')
                });
            }
        } catch (error) {
            console.error('Error reviewing pull request:', error);
            throw error;
        }
    }
}

export { EfficientReviewBot };