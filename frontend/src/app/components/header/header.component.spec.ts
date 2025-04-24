import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HeaderComponent
            ],
            providers: [
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);

        // Mock router url
        jest.spyOn(router, 'url', 'get').mockReturnValue('/');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should contain navigation links', () => {
        const links = fixture.debugElement.queryAll(By.css('.nav-links a'));
        expect(links.length).toBe(2);

        // Check links text
        expect(links[0].nativeElement.textContent.trim()).toBe('Todos List');
        expect(links[1].nativeElement.textContent.trim()).toBe('Add Todo');

        // Check router links
        expect(links[0].attributes['routerLink']).toBe('/');
        expect(links[1].attributes['routerLink']).toBe('/add');
    });

    it('should mark the active route', () => {
        const homeLink = fixture.debugElement.query(By.css('.nav-links a[routerLink="/"]'));

        // With router url as '/'
        expect(component.isActive('/')).toBe(true);
        expect(component.isActive('/add')).toBe(false);

        // Update mock to test other route
        jest.spyOn(router, 'url', 'get').mockReturnValue('/add');
        fixture.detectChanges();

        expect(component.isActive('/add')).toBe(true);
        expect(component.isActive('/')).toBe(false);
    });
}); 