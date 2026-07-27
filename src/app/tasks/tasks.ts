import { ChangeDetectorRef ,Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Task } from '../models/Task';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  editingTaskId: string | null = null;

  taskForm!: FormGroup;

  searchText = '';
selectedStatus = '';
selectedPriority = '';
selectedCategory = '';

  categories: string[] = [
    'Assignment',
    'Project',
    'Study',
    'Examination',
    'Personal',
    'Others'
  ];

  priorities: string[] = [
    'HIGH',
    'MEDIUM',
    'LOW'
  ];

  statuses: string[] = [
    'PENDING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private cdr: ChangeDetectorRef
    // private ngZone: NgZone

  ) {}


  ngOnInit(): void {

    // 1. Initialize the form first
    this.taskForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],

      category: [
        '',
        Validators.required
      ],

      priority: [
        '',
        Validators.required
      ],

      status: [
        '',
        Validators.required
      ],

      deadline: ['']

    });

    // 2. Then load tasks
    this.loadTasks();
  }


  // -------------------------
  // FORM GETTERS
  // -------------------------

  get title() {
    return this.taskForm.get('title');
  }

  get description() {
    return this.taskForm.get('description');
  }

  get category() {
    return this.taskForm.get('category');
  }

  get priority() {
    return this.taskForm.get('priority');
  }

  get status() {
    return this.taskForm.get('status');
  }

  get deadline() {
    return this.taskForm.get('deadline');
  }


  // -------------------------
  // LOAD TASKS
  // -------------------------

  async loadTasks(): Promise<void> {

    const { data, error } =
      await this.taskService.getTasks();

    if (error) {
      console.error('Error loading tasks:', error);
      return;
    }

    //  this.ngZone.run(() => {
    // });
    this.tasks = data ?? [];

    console.log('Loaded tasks:', this.tasks);

      this.cdr.detectChanges();

  }


  // -------------------------
  // CREATE / UPDATE
  // -------------------------

  async onSubmit(): Promise<void> {

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValue = this.taskForm.getRawValue();

    const task: Partial<Task> = {

      title: formValue.title,

      description:
        formValue.description || undefined,

      category:
        formValue.category,

      priority:
        formValue.priority,

      status:
        formValue.status,

      deadline:
        formValue.deadline || undefined,

      is_completed:
        formValue.status === 'COMPLETED'

    };


    // UPDATE EXISTING TASK
    if (this.editingTaskId) {

      const { error } =
        await this.taskService.updateTask(
          this.editingTaskId,
          task
        );

      if (error) {
        console.error('Update failed:', error);
        return;
      }

      console.log('Task updated successfully');

      this.editingTaskId = null;

    }

    // CREATE NEW TASK
    else {

      const { error } =
        await this.taskService.createTask(
          task as Task
        );

      if (error) {
        console.error('Create failed:', error);
        return;
      }

      console.log('Task created successfully');
    }


    // Reset form
    this.taskForm.reset();

    // Reload tasks
    await this.loadTasks();
  }


  // -------------------------
  // EDIT TASK
  // -------------------------

  editTask(task: Task): void {

    if (!task.id) {
      console.error('Task ID is missing');
      return;
    }

    console.log('Editing task:', task);

    this.editingTaskId = task.id;

    this.taskForm.patchValue({

      title:
        task.title,

      description:
        task.description ?? '',

      category:
        task.category,

      priority:
        task.priority,

      status:
        task.status,

      // HTML date input requires YYYY-MM-DD
      deadline:
        task.deadline
          ? task.deadline.substring(0, 10)
          : ''

    });

    // Move user back to form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // -------------------------
  // CANCEL EDIT
  // -------------------------

  cancelEdit(): void {

    this.editingTaskId = null;

    this.taskForm.reset();
  }

  async deleteTask(task: Task): Promise<void> {

  if (!task.id) {
    console.error('Task ID is missing');
    return;
  }

  const confirmed = confirm(
    `Are you sure you want to delete "${task.title}"?`
  );

  if (!confirmed) {
    return;
  }

  const { error } = await this.taskService.deleteTask(task.id);

  if (error) {
    console.error('Delete failed:', error);
    return;
  }

  console.log('Task deleted successfully');

  // If currently editing the deleted task
  if (this.editingTaskId === task.id) {
    this.cancelEdit();
  }

  await this.loadTasks();
}

get filteredTasks(): Task[] {

  return this.tasks.filter(task => {

    const search = this.searchText.toLowerCase().trim();

    const matchesSearch =
      !search ||
      task.title.toLowerCase().includes(search) ||
      (task.description ?? '').toLowerCase().includes(search);

    const matchesStatus =
      !this.selectedStatus ||
      task.status === this.selectedStatus;

    const matchesPriority =
      !this.selectedPriority ||
      task.priority === this.selectedPriority;

    const matchesCategory =
      !this.selectedCategory ||
      task.category === this.selectedCategory;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory
    );
  });
}
}