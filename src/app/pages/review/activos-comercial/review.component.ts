import { Component, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImageUtils } from '../../../utils/image.util';

@Component({
  selector: 'app-review-activos-comercial',
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {
  @Input() fileWorkbook: XLSX.WorkBook | null = null;
  @Input() mainClass = 'theme-default';
  @Input() baseColor = '#000000';

  planning: any = {
    team: "Experiencia Digital",
    sprint: "Sprint # 5",
    inicio: "01/01/2025",
    fin: "15/01/2025",
    enlaces: [],
    comentarios: []
  }

  graficos = {
    kpi1: {
      imagen: "",
      nombre: ""
    },
    kpi2: {
      imagen: "",
      nombre: ""
    },
    kpi3: {
      imagen: "",
      nombre: ""
    },
    kpi4: {
      imagen: "",
      nombre: ""
    },
    modulos: ""
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

  }

  procesarEnlaces(workbook: XLSX.WorkBook) {
    const worksheet = workbook.Sheets["Enlaces"];

    this.enlaces.review.enlace = worksheet['B1'].v;
    this.enlaces.funcionalidad.enlace = worksheet['B2'].v;
    this.enlaces.qrcode.enlace = worksheet['B3'] == undefined ? "" : worksheet['B3'].v;

  }

  procesarGraficos(workbook: XLSX.WorkBook) {

    const worksheet = workbook.Sheets["Proyectos"];

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

    this.graficos.modulos = this.graficoGantt(data);


    const worksheetKpi = workbook.Sheets["Kpi1"];
    const goal = worksheetKpi['D2'].v;
    const dataKpi = XLSX.utils.sheet_to_json(worksheetKpi, { header: 0 });

    this.graficos.kpi1 = {
      imagen: this.graficoBarra(dataKpi, goal),
      nombre: worksheetKpi['C2'].v
    };

    const worksheetKpi2 = workbook.Sheets["Kpi2"];
    const goalKpi2 = worksheetKpi2['D2'].v;
    const dataKpi2 = XLSX.utils.sheet_to_json(worksheetKpi2, { header: 0 });

    this.graficos.kpi2 = {
      imagen: this.graficoBarra(dataKpi2, goalKpi2),
      nombre: worksheetKpi2['C2'].v
    };


    const worksheetKpi3 = workbook.Sheets["Kpi3"];
    const goalKpi3 = worksheetKpi3['D2'].v;
    const dataKpi3 = XLSX.utils.sheet_to_json(worksheetKpi3, { header: 0 });

    this.graficos.kpi3 = {
      imagen: this.graficoBarra(dataKpi3, goalKpi3),
      nombre: worksheetKpi3['C2'].v
    };

    const worksheetKpi4 = workbook.Sheets["Kpi4"];
    const goalKpi4 = worksheetKpi4['D2'].v;
    const dataKpi4 = XLSX.utils.sheet_to_json(worksheetKpi4, { header: 0 });

    this.graficos.kpi4 = {
      imagen: this.graficoBarra(dataKpi4, goalKpi4),
      nombre: worksheetKpi4['C2'].v
    };

  }

  graficoBarra(kpi: any, meta: any) {
    // let color = this.baseColor;


    let labels: any[] = [];
    let data: any[] = [];

    kpi.forEach((el: { Mes: any; Valor: any; }) => {
      labels.push(el.Mes);
      data.push(el.Valor);
    });



    const chartStr = `{
                        "type": "bar",
                        "data": {
                          "labels": ${JSON.stringify(labels)},
                          "datasets": [
                            {
                              "label": "Dataset 2",
                              "backgroundColor": getGradientFillHelper('vertical', [
                              '#ECFB48',  
                              '#F0C02D',
                                
                              ]),
                              "borderColor": '#F0C02D',  
                              "borderWidth": 1,
                              "data": ${JSON.stringify(data)},
                            }
                          ]
                        },
                        "options": {
                          "responsive": true,
                          "legend": {
                            display: false,
                          },
                          "plugins": {
                            "roundedBars": true 
                          },
                          "annotation": {
                            "annotations": [{
                              "type": 'line',
                              "mode": 'horizontal',
                              "scaleID": 'y-axis-0',
                              "value": ${meta},
                              "borderColor": '#BD0000',
                              "borderWidth": 1,
                              "label": {
                                "enabled": true,
                                "content": 'Meta ${meta}',
                                "backgroundColor": "#BD0000",
                              }
                            }]
                          }
                        },
                        
                      }`;

    let chartImage = "https://quickchart.io/chart?w=232&h=200&c=" + encodeURIComponent(chartStr);

    console.log(chartImage);
    return chartImage;
  }

  graficoGantt(data: any[]) {
    // backgroundColor: ['rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)', 'rgba(0, 191, 153, 1)'],

    //let color = this.baseColor;

    let labels: any[] = [];
    let dataProject = '[';

    data.forEach(el => {
      labels.push(el.Modulo);
      dataProject += "[new Date('" + el.Inicio + "'), new Date('" + el.Fin + "')],";
    });

    dataProject += ']';

    console.log(dataProject);

    let chartStr = `{
          type: 'horizontalBar',
          data: {
            "labels": ${JSON.stringify(labels)},
            datasets: [{
              data: ${dataProject},
              backgroundColor: '#F0C02D',
            }, ],
          },
          options: {
            legend: {
              display: false
            },
            annotation: {
              annotations: [{
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: new Date('2021-10-30'),
                borderColor: 'red',
                borderWidth: 1,
                label: {
                  enabled: true,
                  content: 'Deadline',
                  position: 'bootom'
                }
              },
              {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: new Date('2021-09-30'),
                borderColor: 'blue',
                borderWidth: 1,
                label: {
                  enabled: true,
                  content: 'Hoy',
                  position: 'top'
                }
              }]
            },
            scales: {
              xAxes: [{
                position: 'top',
                type: 'time',
                time: {
                  unit: 'month'
                },
                ticks: {
                  min: new Date('2024-01-01'),
                  max: new Date('2024-12-31'),
                }
              }],
            },
          },
        }`;


    return "https://quickchart.io/chart?w=950&h=300&c=" + encodeURIComponent(chartStr);

  }


}
