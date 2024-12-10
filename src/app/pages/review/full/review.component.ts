import { Component, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImageUtils } from '../../../utils/image.util';

@Component({
  selector: 'app-review-full',
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  @Input() fileWorkbook: XLSX.WorkBook | null = null;
  @Input() mainClass = 'theme-default';
  @Input() baseColor = '#000000';

  planning: any = {
    team: "Poket",
    sprint: "Sprint # 18",
    inicio: "01/01/2025",
    fin: "15/01/2025",
    enlaces: [],
    comentarios: [],
    riesgos: [],
    alcance: [],
    mvp: {
      nombre: '',
      imagen: '',
      logros: []
    }
  }

  graficos = {
    avance: 0,
    general: "",
    avancesEspecialidad: "",
    velocidadEquipo: "",
    velocidadMiembros: "",
    modulos: "",
    enlaces: ""
  }

  enlaces = {
    review: { imagen: "", enlace: "" },
    funcionalidad: { imagen: "", enlace: "" },
    qrcode: { imagen: "", enlace: "" },
  };

  logoImage: string = "";

  ngOnInit(): void {
    ImageUtils.toDataURL("./assets/images/logowhite.png", (dataUrl: any) => {
      this.logoImage = dataUrl;
    });

    ImageUtils.toDataURL("./assets/images/review.png", (dataUrl: any) => {
      this.enlaces.review.imagen = dataUrl;
    });

    ImageUtils.toDataURL("./assets/images/funcionalidades.png", (dataUrl: any) => {
      this.enlaces.funcionalidad.imagen = dataUrl;
    });

    ImageUtils.toDataURL("./assets/images/codigoqr.png", (dataUrl: any) => {
      this.enlaces.qrcode.imagen = dataUrl;
    });


  }

  ngOnChanges(): void {
    if (this.fileWorkbook) {
      this.procesarGeneralidades(this.fileWorkbook);
      this.procesarComentarios(this.fileWorkbook);
      this.procesarEnlaces(this.fileWorkbook);
      this.procesarGraficos(this.fileWorkbook);
    }
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

  procesarComentarios(workbook: XLSX.WorkBook) {
    const worksheet = workbook.Sheets["Comentarios"];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

    data.forEach((value: any) => {
      if (value.Comentarios != undefined)
        this.planning.comentarios.push(value);
    });

    // Riesgos
    const worksheetRi = workbook.Sheets["Riesgos"];
    const dataRiesgos = XLSX.utils.sheet_to_json(worksheetRi, { header: 0 });

    dataRiesgos.forEach((value: any) => {
      if (value.Riesgo != undefined)
        this.planning.riesgos.push(value.Riesgo);
    });

    // Alcance / Objetivos
    const worksheetObj = workbook.Sheets["Objetivos"];
    const dataAlcance = XLSX.utils.sheet_to_json(worksheetObj, { header: 0 });

    dataAlcance.forEach((value: any) => {
      if (value.Objetivo != undefined)
        this.planning.alcance.push(value);
    });


    //MVP
    const worksheetMVP = workbook.Sheets["MVP"];
    const dataMVP = XLSX.utils.sheet_to_json(worksheetMVP, { header: 0 });

    this.planning.mvp.nombre = worksheetMVP['A2'].v;
    this.planning.mvp.imagen = worksheetMVP['B2'].v;

    dataMVP.forEach((value: any) => {
      if (value.Logros != undefined)
        this.planning.mvp.logros.push(value);
    });


  }

  procesarEnlaces(workbook: XLSX.WorkBook) {
    const worksheet = workbook.Sheets["Enlaces"];
    const dataEnlaces = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

    dataEnlaces.forEach((value: any) => {
      if (value.Titulo != undefined)
        this.planning.enlaces.push(value);
    });


  }

  procesarGraficos(workbook: XLSX.WorkBook) {
    const worksheet = workbook.Sheets["Modulos"];
    const worksheetGen = workbook.Sheets["Generalidades"];
    const worksheetAva = workbook.Sheets["Avance"];
    const worksheetVelEq = workbook.Sheets["VelocidadTeam"];
    const worksheetVelMem = workbook.Sheets["VelocidadMiembro"];


    this.graficos.general = this.graficoGeneral(worksheetGen['B5'].v);
    this.graficos.avancesEspecialidad = this.graficoAvanceEpecialidad(worksheetAva);
    this.graficos.velocidadEquipo = this.graficoVelocidadEquipo(worksheetVelEq);
    this.graficos.velocidadMiembros = this.graficoVelocidadMiembros(worksheetVelMem);

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

    this.graficos.modulos = this.graficoGantt(data);

  }

  graficoGeneral(avanceGeneral: any) {

    this.graficos.avance= avanceGeneral;
    let color = this.getBaseColor();
    const chartStr = `{
                          type: 'pie',
                          data: {
                            datasets: [
                              {
                                data: [${avanceGeneral}, ${100-avanceGeneral}],
                                backgroundColor: [
                                  '${color}',
                                  '#999',
                                ],
                                label: 'Dataset 1',
                              },
                            ]
                          },
                          options: {
                              legend: {
                                display: false,
                              },
                              plugins: {
                                datalabels: {
                                  color: '#FFF',
                                  align: 'end',
                                  formatter: (val) => val + '%',
                                  font: {
                                    size: 14,
                                    weight: 'bold',
                                  },
                                },
                              },
                            },
                        }`;

    let chartImage = "https://quickchart.io/chart?w=200&h=200&c=" + encodeURIComponent(chartStr);
    return chartImage;
  }

  graficoAvanceEpecialidad(avanceEpecialidad: any) {

    const data = XLSX.utils.sheet_to_json(avanceEpecialidad, { header: 0 });

    
    let color = this.getBaseColor();

    let labels: any[] = [];
    let dataPlus: any[] = [];
    
    data.forEach((el: any) => {
      labels.push(el.Especialidad);
      dataPlus.push(el.Avance);
    });


    const chartStr = `{
                        type: 'bar',
                        data: {
                          labels: ${JSON.stringify(labels)},
                          datasets: [
                            {
                              backgroundColor: '${color}',
                              data: ${JSON.stringify(dataPlus)},
                              datalabels: {
                                align: 'top',
                                anchor: 'end',
                                color: '#000',
                                display: true, // Display datalabels for the top dataset
                              },
                            },
                          ],
                        },
                        options: {
                          legend: {
                            display: false,
                          },
                          plugins: {
                                datalabels: {
                                  color: '#FFF',
                                  align: 'end',
                                  formatter: (val) => val + '%',
                                },
                              },
                          scales: {
                            yAxes: [
                              {
                                stacked: true,
                                ticks: {
                                  beginAtZero: true,
                                  max: 120,
                                },
                              },
                            ],
                            xAxes: [
                              {
                                stacked: true,
                              },
                            ],
                          },
                        },
                      }`;

    let chartImage = "https://quickchart.io/chart?w=400&h=200&c=" + encodeURIComponent(chartStr);
    return chartImage;

  }


  graficoGantt(data: any[]) {
    // backgroundColor: ['rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)'],

    let color = this.getBaseColor();

    let labels: any[] = [];
    let dataPlus: any[] = [];
    let dataMinus: any[] = [];

    data.forEach(el => {
      labels.push(el.Modulo);
      dataPlus.push(el.Avance);
      dataMinus.push(100 - el.Avance);
    });

    let chartStr = `{
            type: 'horizontalBar',
            data: {
              labels: ${JSON.stringify(labels)},
              datasets: [
                {
                  backgroundColor:  ['${color}'],
                  data: ${JSON.stringify(dataPlus)},
                },
                {
                  "borderColor": "#bbb",
                  "borderWidth": 1,
                  backgroundColor: '#eaeaea',
                  data: ${JSON.stringify(dataMinus)},
                },
              
              ],
            },
            options: {
              plugins: {
                datalabels: {
                  anchor: 'center',
                  align: 'end',
                  color: 'white',
                  font: {
                    size: 14,
                    weight: 'bold'
                  },
                  formatter: (value, context)  =>  context.datasetIndex === 0 ?  value + '%' : ''
                },
              },
               legend: {
                      display: false
                   },
                   
              scales: {
                xAxes: [
                  {
                    stacked: true,
                    ticks: {
                          min: 0,
                          max: 100,
                        }
                  },
                  
                ],
                yAxes: [
                  {
                    stacked: true,
                      ticks: {
                            fontSize: 14
                          }
                  },
                ],
              },
            },
          }
          `;


    return "https://quickchart.io/chart?w=600&h=400&c=" + encodeURIComponent(chartStr);

  }


  graficoVelocidadEquipo(velocidadEquipo: any){
    const data = XLSX.utils.sheet_to_json(velocidadEquipo, { header: 0 });
    
    let color = this.getBaseColor();

    let labels: any[] = [];
    let dataPlan: any[] = [];
    let dataEje: any[] = [];
    
    data.forEach((el: any) => {
      labels.push(el.Sprint);
      dataPlan.push(el.Plan);
      dataEje.push(el.Ejecutado);
    });

    const chartStr = `{
                        "type": "bar",
                        "data": {
                          "labels":${JSON.stringify(labels)},
                          "datasets": [
                            {
                              "type": "line",
                              "label": "Planeado",
                              "backgroundColor": "#999",
                              "borderColor": "#999",
                              "borderWidth": 1,
                              "fill": false,
                              "data": ${JSON.stringify(dataPlan)},
                            },
                            {
                              "type": "bar",
                              "label": "Finalizado",
                              "backgroundColor": "${color}",
                              "data": ${JSON.stringify(dataEje)},
                            
                            },
                          ]
                        },
                        "options": {
                          "responsive": true,
                          "tooltips": {
                            "mode": "index",
                            "intersect": true
                          },
                          "plugins": {
                            "datalabels": {
                              "color": '#000',
                              "align": 'end',
                              "anchor": 'end'
                            },
                          },
                        }
                      }`;

    let chartImage = "https://quickchart.io/chart?w=600&h=200&c=" + encodeURIComponent(chartStr);
    return chartImage;

  }


  graficoVelocidadMiembros(velocidadMiembros: any){
    const data = XLSX.utils.sheet_to_json(velocidadMiembros, { header: 0 });
    
    let color = this.getBaseColor();

    let labels: any[] = [];
    let dataPlan: any[] = [];
    let dataEje: any[] = [];
    
    data.forEach((el: any) => {
      labels.push(el.Miembro);
      dataPlan.push(el.Plan);
      dataEje.push(el.Ejecutado);
    });

    const chartStr = `{
                        "type": "horizontalBar",
                        "data": {
                          "labels":${JSON.stringify(labels)},
                          "datasets": [
                            {
                              "label": "Planeado",
                              "backgroundColor": "#999",
                              "borderColor": "#999",
                              "borderWidth": 1,
                              "fill": false,
                              "data": ${JSON.stringify(dataPlan)},
                            },
                            {
                              "label": "Finalizado",
                              "backgroundColor": "${color}",
                              "data": ${JSON.stringify(dataEje)},
                            
                            },
                          ]
                        },
                        "options": {
                          "responsive": true,
                          "tooltips": {
                            "mode": "index",
                            "intersect": true
                          },
                          "plugins": {
                            "datalabels": {
                              "color": '#000',
                              "align": 'end',
                              "anchor": 'end'
                            },
                          },
                        }
                      }`;

    let chartImage = "https://quickchart.io/chart?w=600&h=300&c=" + encodeURIComponent(chartStr);
    return chartImage;

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

    return "#000000";
  }
}
