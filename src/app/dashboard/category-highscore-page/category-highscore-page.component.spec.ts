import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryHighscorePageComponent } from './category-highscore-page.component';

describe('CategoryHighscorePageComponent', () => {
  let component: CategoryHighscorePageComponent;
  let fixture: ComponentFixture<CategoryHighscorePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryHighscorePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryHighscorePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
