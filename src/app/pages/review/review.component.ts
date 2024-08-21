import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImageUtils } from '../../utils/image.util';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Value } from '@angular/fire/compat/remote-config';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {


  arrayBuffer: any;
  filelist: any;

  mainClass = 'theme-default';

  fileWorkbook: XLSX.WorkBook | null = null;
  planning: any = {
    team: "Experiencia Digital",
    sprint: "Sprint # 5",
    inicio: "01/01/2025",
    fin: "15/01/2025",
    enlaces: [],
    comentarios: []
  }

  graficos = {
    general: "",
    ux: {
      imagen: "", value: 0
    },
    be: {
      imagen: "", value: 0
    },
    fe: {
      imagen: "", value: 0
    },
    modulos: ""
  }

  enlaces = {
    review: { imagen: "", enlace: "" },
    funcionalidad: { imagen: "", enlace: "" },
    qrcode: { imagen: "", enlace: "" },
  };


  themes = ['theme-default', 'theme-exp-digital', 'theme-poket', 'theme-activos-comercial', 'theme-activos-juridico-core'];

  logoImage: string = "";

  addFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.error("No file selected.");
      return;
    }

    const file = input.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result;
      if (!arrayBuffer) {
        console.error("File could not be read.");
        return;
      }

      const data = new Uint8Array(arrayBuffer as ArrayBuffer);
      const bstr = String.fromCharCode(...data);
      const workbook = XLSX.read(bstr, { type: "binary" });

      this.fileWorkbook = workbook;
    };

    fileReader.onerror = () => {
      console.error("Error reading file.");
    };

    fileReader.readAsArrayBuffer(file);
  }

  getBaseColor() {
    if (this.mainClass == 'theme-default') {
      return "#008866";
    }

    if (this.mainClass == 'theme-exp-digital') {
      return "rgba(0, 167, 233, 1)";
    }


    if (this.mainClass == 'theme-poket') {
      return "rgba(17, 55, 192, 1)";
    }

    if (this.mainClass == 'theme-activos-comercial') {
      return "rgba(0, 167, 233, 1)";
    }
    if (this.mainClass == 'theme-activos-juridico-core') {
      return "#1C3258";
    }

    return "#000000";
  }
}
