import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Resource } from '../models/Resource';
import { ResourceService } from '../services/resource.service';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './resources.html',
  styleUrl: './resources.css'
})
export class ResourcesComponent implements OnInit {

  resourceForm!: FormGroup;

  resources: Resource[] = [];

  selectedFile: File | null = null;

  uploading = false;


  constructor(
    private fb: FormBuilder,
    private resourceService: ResourceService
  ) {}


  ngOnInit(): void {

    this.resourceForm = this.fb.group({

      title: [
        '',
        Validators.required
      ],

      subject: ['']

    });


    this.loadResources();
  }


  // ---------------------------
  // FILE SELECT
  // ---------------------------

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      this.selectedFile = null;

      return;
    }


    const file =
      input.files[0];


    // 3 MB
    const maxSize =
      3 * 1024 * 1024;


    if (file.size > maxSize) {

      alert(
        'File must be smaller than 3 MB.'
      );

      input.value = '';

      this.selectedFile = null;

      return;
    }


    this.selectedFile = file;

    console.log(
      'Selected file:',
      file
    );
  }


  // ---------------------------
  // UPLOAD
  // ---------------------------

  async onSubmit(): Promise<void> {

    if (this.resourceForm.invalid) {

      this.resourceForm.markAllAsTouched();

      return;
    }


    if (!this.selectedFile) {

      alert(
        'Please select a file.'
      );

      return;
    }


    this.uploading = true;


    const {
      title,
      subject
    } = this.resourceForm.getRawValue();


    try {

      const { error } =
        await this.resourceService.uploadResource(
          this.selectedFile,
          title,
          subject
        );


      if (error) {

        console.error(
          'Upload failed:',
          error
        );

        return;
      }


      console.log(
        'Resource uploaded successfully'
      );


      this.resourceForm.reset();

      this.selectedFile = null;


      // Clear file input
      const fileInput =
        document.getElementById(
          'resourceFile'
        ) as HTMLInputElement;


      if (fileInput) {
        fileInput.value = '';
      }


      await this.loadResources();

    }

    catch (error) {

      console.error(
        'Upload error:',
        error
      );

    }

    finally {

      this.uploading = false;

    }
  }


  // ---------------------------
  // LOAD
  // ---------------------------

  async loadResources(): Promise<void> {

    const {
      data,
      error
    } =
      await this.resourceService.getResources();


    if (error) {

      console.error(
        'Loading resources failed:',
        error
      );

      return;
    }


    this.resources =
      data ?? [];
  }


  // ---------------------------
  // OPEN
  // ---------------------------

  async openResource(
    resource: Resource
  ): Promise<void> {

    const {
      data,
      error
    } =
      await this.resourceService.getResourceUrl(
        resource.file_path
      );


    if (error) {

      console.error(
        'Could not open file:',
        error
      );

      return;
    }


    window.open(
      data.signedUrl,
      '_blank'
    );
  }


  // ---------------------------
  // DELETE
  // ---------------------------

  async deleteResource(
    resource: Resource
  ): Promise<void> {

    if (
      !confirm(
        `Delete "${resource.title}"?`
      )
    ) {

      return;
    }


    const { error } =
      await this.resourceService.deleteResource(
        resource
      );


    if (error) {

      console.error(
        'Delete failed:',
        error
      );

      return;
    }


    await this.loadResources();
  }

}