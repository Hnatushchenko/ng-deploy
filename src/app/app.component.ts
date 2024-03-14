import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  form = this.formBuilder.group({
    diffStringControl: '',
  });

  get diffStringControl() {
    return this.form.controls.diffStringControl;
  }

  @ViewChild('diff2html')
  diff2html!: ElementRef;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngAfterViewInit() {
    this.subscribeToDiffStringChanges();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private subscribeToDiffStringChanges() {
    this.subscription.add(
      this.diffStringControl.valueChanges
        .pipe(
          map(diffString => diffString ?? ''),
          debounceTime(250)
        )
        .subscribe(diffString => {
          const diff2htmlUi = new Diff2HtmlUI(this.diff2html.nativeElement, diffString);
          diff2htmlUi.draw();
        })
    );
  }
}
