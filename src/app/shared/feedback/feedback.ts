import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class FeedbackComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() show: boolean = false;

  close() {
    this.show = false;
  }
}