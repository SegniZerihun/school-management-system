import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../_services/auth';
import { MarkService } from '../../_services/mark';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, MatIconModule, MatButtonModule,
    MatCardModule, MatTableModule, MatSnackBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['subject', 'marks'];
  dataSource: any[] = [];

  constructor(
    public authService: AuthService,
    private markService: MarkService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const studentId = this.authService.getUserId();

    if (studentId) {
      this.markService.getMarksForStudent(studentId).subscribe({
        next: (res) => {
          this.dataSource = res.data;
        },
        error: (err) => {
          this.snackBar.open('Could not load marks.', 'Close', { duration: 3000 });
          console.error(err);
        }
      });
    } else {
      this.snackBar.open('Could not identify student.', 'Close', { duration: 3000 });
    }
  }
}