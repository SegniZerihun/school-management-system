import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradeService } from '../../_services/grade';
import { GradeFormComponent } from '../grade-form/grade-form';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-grade-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    GradeFormComponent
  ],
  templateUrl: './grade-list.html',
  styleUrls: ['./grade-list.scss']
})
export class GradeListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions']; // Grade only has 'name' and 'actions'
  dataSource: any[] = [];

  constructor(
    private gradeService: GradeService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.gradeService.getGrades().subscribe({
      next: (res) => { this.dataSource = res.data; },
      error: (err) => { this.handleError('Failed to load grades'); }
    });
  }

  addGrade(): void {
    const dialogRef = this.dialog.open(GradeFormComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gradeService.createGrade(result).subscribe({
          next: () => {
            this.handleSuccess('Grade created successfully!');
            this.loadGrades();
          },
          error: (err) => { this.handleError('Failed to create grade'); }
        });
      }
    });
  }

  editGrade(grade: any): void {
    const dialogRef = this.dialog.open(GradeFormComponent, {
      width: '400px',
      data: grade
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gradeService.updateGrade(grade._id, result).subscribe({
          next: () => {
            this.handleSuccess('Grade updated successfully!');
            this.loadGrades();
          },
          error: (err) => { this.handleError('Failed to update grade'); }
        });
      }
    });
  }

  deleteGrade(id: string): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.gradeService.deleteGrade(id).subscribe({
        next: () => {
          this.handleSuccess('Grade deleted successfully!');
          this.loadGrades();
        },
        error: (err) => { this.handleError('Failed to delete grade'); }
      });
    }
  }

  private handleSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private handleError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}