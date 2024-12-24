import { EfficientReviewBot } from './reviewBot.mjs';

async function main() {
    // Get environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const [owner, repo] = process.env.GITHUB_REPOSITORY?.split('/') || [];
    const prNumber = parseInt(process.env.GITHUB_EVENT_NUMBER || '');

    // Validate environment
    if (!githubToken || !anthropicKey || !owner || !repo || !prNumber) {
        console.error('Missing required environment variables');
        process.exit(1);
    }

    try {
        // Initialize and run the review bot
        const reviewBot = new EfficientReviewBot(githubToken, anthropicKey);
        await reviewBot.reviewPullRequest(owner, repo, prNumber);
        console.log('Code review completed successfully');
    } catch (error) {
        console.error('Error during code review:', error);
        process.exit(1);
    }
}

main();