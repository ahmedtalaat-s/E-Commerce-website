import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent implements OnInit, AfterViewInit {




  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.handleScrollAnimations();
    this.addRippleAnimation();
  }

  ngAfterViewInit(): void {
    this.addCardHoverEffect();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.updateScrollIndicator();
    this.handleScrollAnimations();
    this.updateHeader();
    this.applyParallaxEffect();
  }

  updateScrollIndicator() {
    const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const indicator = this.el.nativeElement.querySelector('#scrollIndicator');
    if (indicator) {
      this.renderer.setStyle(indicator, 'width', scrolled + '%');
    }
  }

  handleScrollAnimations() {
    const elements = this.el.nativeElement.querySelectorAll('.fade-in');
    elements.forEach((element: HTMLElement) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      if (elementTop < window.innerHeight - elementVisible) {
        this.renderer.addClass(element, 'visible');
      }
    });
  }

  updateHeader() {
    const header = this.el.nativeElement.querySelector('.header');
    if (header) {
      const background = window.scrollY > 100 ? 'rgba(15, 23, 42, 0.98)' : 'rgba(15, 23, 42, 0.95)';
      this.renderer.setStyle(header, 'background', background);
    }
  }

  applyParallaxEffect() {
    const hero = this.el.nativeElement.querySelector('.hero');
    if (hero) {
      const scrolled = window.pageYOffset;
      this.renderer.setStyle(hero, 'transform', `translateY(${scrolled * 0.5}px)`);
    }
  }

  addCardHoverEffect() {
    const cards = this.el.nativeElement.querySelectorAll('.feature-card, .service-card');
    cards.forEach((card: HTMLElement) => {
      this.renderer.listen(card, 'mouseenter', () => {
        this.renderer.setStyle(card, 'transform', 'translateY(-8px) rotateX(5deg)');
      });
      this.renderer.listen(card, 'mouseleave', () => {
        this.renderer.setStyle(card, 'transform', 'translateY(0) rotateX(0)');
      });
    });
  }

  addRippleAnimation() {
    const buttons = this.el.nativeElement.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn, .service-btn');
    buttons.forEach((btn: HTMLElement) => {
      this.renderer.listen(btn, 'click', (e: MouseEvent) => {
        e.preventDefault();

        const ripple = this.renderer.createElement('span');
        this.renderer.setStyle(ripple, 'position', 'absolute');
        this.renderer.setStyle(ripple, 'borderRadius', '50%');
        this.renderer.setStyle(ripple, 'background', 'rgba(255, 255, 255, 0.6)');
        this.renderer.setStyle(ripple, 'transform', 'scale(0)');
        this.renderer.setStyle(ripple, 'animation', 'ripple 0.6s linear');
        this.renderer.setStyle(ripple, 'left', (e.clientX - (e.target as HTMLElement).offsetLeft) + 'px');
        this.renderer.setStyle(ripple, 'top', (e.clientY - (e.target as HTMLElement).offsetTop) + 'px');
        this.renderer.setStyle(ripple, 'width', '20px');
        this.renderer.setStyle(ripple, 'height', '20px');

        this.renderer.setStyle(btn, 'position', 'relative');
        this.renderer.setStyle(btn, 'overflow', 'hidden');
        this.renderer.appendChild(btn, ripple);

        setTimeout(() => {
          this.renderer.removeChild(btn, ripple);
        }, 600);
      });
    });

    // Add ripple animation to styles dynamically
    const style = this.renderer.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    this.renderer.appendChild(document.head, style);
  }
}


