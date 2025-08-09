import { Component, ElementRef, Input, ViewChild, viewChild } from '@angular/core';
import { ProductServicesService } from '../../../../../services/product-services.service';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  image = new Image();
  shirtImage = new Image();
  isDragging = false;
  imgX = 100;
  imgY = 100;
  offsetX = 0;
  offsetY = 0;
  width:number=100
  height: number = 100
  imageUrl!: string
  rowDesignUrl!:string
  imageFile!:File
  @Input() backgroundImage!:any

  constructor(private _productservices:ProductServicesService) {

  }

 ngAfterViewInit() {
  const canvas = this.canvasRef.nativeElement;
  this.ctx = canvas.getContext('2d')!;
  this.shirtImage.crossOrigin = 'anonymous' // Correct filename
  this.shirtImage.src = this.backgroundImage; // Correct filename
  this.shirtImage.onload = () => {
    this.drawCanvas(); // draw once shirt is loaded
  };
  this.shirtImage.onerror = () => {
    console.error('Failed to load shirt image:', this.shirtImage.src);
  };

  canvas.addEventListener('mousedown', this.startDrag.bind(this));
  canvas.addEventListener('mouseup', this.stopDrag.bind(this));
  canvas.addEventListener('mousemove', this.drag.bind(this));
}


  onFileChange(event: any) {
    const file = event.target.files[0];
    this.imageFile = file

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.image.onload = () => {
         this.drawCanvas();
      };
      this.image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

 drawCanvas() {
  const canvas = this.canvasRef.nativeElement;
  this.ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw shirt background
  this.ctx.drawImage(this.shirtImage, 0, 0, canvas.width, canvas.height);

  // Then draw user image
  if (this.image.src) {
    this.ctx.drawImage(this.image, this.imgX, this.imgY, this.width, this.height);
  }

}


  startDrag(e: MouseEvent) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (
      mouseX >= this.imgX &&
      mouseX <= this.imgX + 150 &&
      mouseY >= this.imgY &&
      mouseY <= this.imgY + 150
    ) {
      this.isDragging = true;
      this.offsetX = mouseX - this.imgX;
      this.offsetY = mouseY - this.imgY;
    }
  }

  drag(e: MouseEvent) {
    if (this.isDragging) {
      this.imgX = e.offsetX - this.offsetX;
      this.imgY = e.offsetY - this.offsetY;
      this.drawCanvas();
    }
  }

  stopDrag() {
    this.isDragging = false;
  }


  increaseSize() {
    this.width+=10
    this.height += 10
    this.drawCanvas()
  }
  decreaseSize() {
    this.width-=10
    this.height -= 10
    this.drawCanvas()
  }

  public saveCanvas(): any {
    if (this.imageFile) {
       const canvas = this.canvasRef.nativeElement;
    return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject('Blob generation failed');
        return;
      }

      try {
        const url = await this._productservices.uploadImageToDesigns(blob) as string;
        const url2 = await this._productservices.uploadRowDesignToSupabase(this.imageFile) as string;
        let urls = {
          url,
          url2
        }
        resolve(urls);
      } catch (error) {
        reject(error);
      }
    });
  })
    }
    else {
      return {url:'',url2:''}
    }
  }


}
