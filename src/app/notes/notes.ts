import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { Note } from '../models/Note';
import { NoteService } from '../services/note.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './notes.html',
  styleUrl: './notes.css'
})
export class NotesComponent implements OnInit {

  // All notes from Supabase
  notes: Note[] = [];

  // ID of note currently being edited
  editingNoteId: string | null = null;

  // Search
  searchText = '';
  currentPage = 1;
pageSize = 5;

  // Form
  noteForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private cdr: ChangeDetectorRef
    // private ngZone: NgZone

  ) {}


  ngOnInit(): void {

    // Create form first
    this.noteForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],

      content: [
        '',
        [
          Validators.maxLength(2000)
        ]
      ],

      subject: [
        '',
        [
          Validators.required
        ]
      ]

    });

    // Then fetch notes
    this.loadNotes();
  }


  // -------------------------
  // GETTERS
  // -------------------------

  get title() {
    return this.noteForm.get('title');
  }

  get content() {
    return this.noteForm.get('content');
  }

  get subject() {
    return this.noteForm.get('subject');
  }


  // -------------------------
  // LOAD NOTES
  // -------------------------

  async loadNotes(): Promise<void> {

    const { data, error } =
      await this.noteService.getNotes();

    if (error) {
      console.error('Error loading notes:', error);
      return;
    }

    // this.ngZone.run(() => {
    // });
    this.notes = data ?? [];

    // console.log('Loaded notes:', this.notes);

      this.cdr.detectChanges();

  }


  // -------------------------
  // CREATE / UPDATE
  // -------------------------

  async onSubmit(): Promise<void> {

    if (this.noteForm.invalid) {

      this.noteForm.markAllAsTouched();

      return;
    }

    const formValue = this.noteForm.getRawValue();

    const note: Partial<Note> = {

      title: formValue.title,

      content:
        formValue.content || undefined,

      subject:
        formValue.subject

    };


    // UPDATE
    if (this.editingNoteId) {

      const { error } =
        await this.noteService.updateNote(
          this.editingNoteId,
          note
        );

      if (error) {

        console.error(
          'Note update failed:',
          error
        );

        return;
      }

      // console.log(
      //   'Note updated successfully'
      // );

      this.editingNoteId = null;

    }

    // CREATE
    else {

      const { error } =
        await this.noteService.createNote(
          note as Note
        );

      if (error) {

        console.error(
          'Note creation failed:',
          error
        );

        return;
      }

      // console.log(
      //   'Note created successfully'
      // );
    }


    this.noteForm.reset();

    await this.loadNotes();
  }


  // -------------------------
  // EDIT
  // -------------------------

  editNote(note: Note): void {

    if (!note.id) {

      console.error(
        'Note ID is missing'
      );

      return;
    }

    this.editingNoteId = note.id;

    this.noteForm.patchValue({

      title:
        note.title,

      content:
        note.content ?? '',

      subject:
        note.subject ?? ''

    });


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  // -------------------------
  // CANCEL EDIT
  // -------------------------

  cancelEdit(): void {

    this.editingNoteId = null;

    this.noteForm.reset();
  }


  // -------------------------
  // DELETE
  // -------------------------

  async deleteNote(note: Note): Promise<void> {

    if (!note.id) {

      console.error(
        'Note ID is missing'
      );

      return;
    }


    const confirmed = confirm(
      `Are you sure you want to delete "${note.title}"?`
    );


    if (!confirmed) {
      return;
    }


    const { error } =
      await this.noteService.deleteNote(
        note.id
      );


    if (error) {

      console.error(
        'Delete failed:',
        error
      );

      return;
    }


    // (
    //   'Note deleted successfully'
    // );console.log


    // If deleting note currently being edited
    if (
      this.editingNoteId === note.id
    ) {

      this.cancelEdit();

    }


    await this.loadNotes();
  }


  // -------------------------
  // SEARCH
  // -------------------------

  get filteredNotes(): Note[] {

    const search =
      this.searchText
        .toLowerCase()
        .trim();


    if (!search) {

      return this.notes;

    }


    return this.notes.filter(note =>

      note.title
        .toLowerCase()
        .includes(search)

      ||

      (note.content ?? '')
        .toLowerCase()
        .includes(search)

      ||

      (note.subject ?? '')
        .toLowerCase()
        .includes(search)

    );

  }

  get paginatedNotes(): Note[] {

  const startIndex =
    (this.currentPage - 1) * this.pageSize;

  return this.filteredNotes.slice(
    startIndex,
    startIndex + this.pageSize
  );
}

get totalPages(): number {

  return Math.ceil(
    this.filteredNotes.length / this.pageSize
  );
}

nextPage(): void {

  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

previousPage(): void {

  if (this.currentPage > 1) {
    this.currentPage--;
  }
}

}