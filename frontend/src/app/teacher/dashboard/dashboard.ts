import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule for ngModel
import { AuthService } from '../../_services/auth';
import { UserService } from '../../_services/user';
import { SubjectService } from '../../_services/subject';
import { MarkService } from '../../_services/mark';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatToolbarModule, MatIconModule, MatButtonModule,
    MatListModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSnackBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  students: any[] = [];
  subjects: any[] = [];
  selectedStudent: any = null;
  marks: { [subjectId: string]: number | null } = {};

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private subjectService: SubjectService,
    private markService: MarkService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    // Fetch all users with the role 'Student'
    this.userService.getUsers('Student').subscribe(res => {
      this.students = res.data;
    });
    // Fetch all subjects
    this.subjectService.getSubjects().subscribe(res => {
      this.subjects = res.data;
    });
  }

  selectStudent(student: any): void {
    this.selectedStudent = student;
    this.marks = {}; // Reset marks when changing student
    // Fetch marks for the selected student
    this.markService.getMarksForStudent(student._id).subscribe(res => {
      // Populate the marks object for easy binding in the template
      res.data.forEach((mark: any) => {
        this.marks[mark.subject._id] = mark.marks;
      });
    });
  }

  onMarkChange(subjectId: string, newMarkValue: string): void {
    const marks = parseInt(newMarkValue, 10);
    if (!this.selectedStudent || isNaN(marks) || marks < 0 || marks > 100) {
      this.snackBar.open('Please enter a valid mark between 0 and 100.', 'Close', { duration: 3000 });
      return;
    }

    const markData = {
      student: this.selectedStudent._id,
      subject: subjectId,
      marks: marks
    };

    this.markService.createOrUpdateMark(markData).subscribe({
      next: () => {
        this.snackBar.open('Mark saved successfully!', 'Close', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Failed to save mark.', 'Close', { duration: 3000 });
        console.error(err);
      }
    });
  }
}