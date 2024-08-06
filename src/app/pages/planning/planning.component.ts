import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImageUtils } from '../../utils/image.util';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.css'
})

export class PlanningComponent implements OnInit {


  arrayBuffer: any;
  filelist: any;

  mainClass = 'theme-default';
  
  planning: any = {
    team: "Experiencia Digital",
    sprint: "Sprint # 5",
    inicio: "01/01/2025",
    fin: "15/01/2025",
    objetivos: [],
    actividades: []
  }


  themes = ['theme-default','theme-exp-digital','theme-poket'];

  logoImage: string = "";

  ngOnInit(): void {
    ImageUtils.toDataURL("./assets/images/logowhite.png", (dataUrl: any) => {
      this.logoImage = dataUrl;
    });
  }

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

      this.procesarGeneralidades(workbook);
      this.procesarActividades(workbook);
    };

    fileReader.onerror = () => {
      console.error("Error reading file.");
    };

    fileReader.readAsArrayBuffer(file);
  }

  getProgressDiv(progress: any) {
    let bg = '#f8d7da';
    let textColor = '#721c24';

    if (progress >= 80 && progress <= 100) {
      bg = '#d1e7dd';
      textColor = '#0f5132';
    }

    if (progress > 50 && progress < 80) {
      bg = '#fff3cd';
      textColor = '#856404';
    }

    return 'width:  ' + progress + '%; background: ' + bg + '; border-radius: 4px; color: ' + textColor + '; font-size: 10pt; padding: 2px';
  }

  procesarGeneralidades(workbook: XLSX.WorkBook) {
    const worksheet = workbook.Sheets["Generalidades"];

    this.planning.team = worksheet['B4'].v;
    this.planning.sprint = worksheet['B3'].v;
    this.planning.fin = worksheet['B2'].v;
    this.planning.inicio = worksheet['B1'].v;
  }

  procesarActividades(workbook: XLSX.WorkBook) {
    const worksheet = workbook.Sheets["Actividades"];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

    data.forEach((value: any) => {
      if (value.Tipo == "Objetivo") {
        this.planning.objetivos.push(value.Actividad);
      }

      this.planning.actividades.push(value);
    });
  }


}
