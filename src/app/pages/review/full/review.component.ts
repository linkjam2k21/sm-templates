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
    const worksheet = workbook.Sheets["Modulos"];
    const worksheetGen = workbook.Sheets["Generalidades"];
    const worksheetAct = workbook.Sheets["Actividades"];

    this.graficos.general = this.graficoGeneral(worksheetGen['B5'].v);
    this.graficos.ux.value = worksheetAct['C3'].v;
    this.graficos.ux.imagen = this.graficoCircularTeam(worksheetAct['C3'].v);

    this.graficos.be.value = worksheetAct['C4'].v;
    this.graficos.be.imagen = this.graficoCircularTeam(worksheetAct['C4'].v);

    this.graficos.fe.value = worksheetAct['C5'].v;
    this.graficos.fe.imagen = this.graficoCircularTeam(worksheetAct['C5'].v);

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 0 });

    this.graficos.modulos = this.graficoGantt(data);

  }

  graficoGeneral(avanceGeneral: any) {

    let color = this.getBaseColor();
    const chartStr = `{
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: [${avanceGeneral}, ${100 - avanceGeneral}],
          backgroundColor: ['${color}', '#eaeaea'],
          label: 'Dataset 1',
          borderWidth: 0,
        },
      ],
    },
    options: {
      circumference: Math.PI,
      rotation: Math.PI,
      cutoutPercentage: 75,
      layout: {
        padding: 40,
      },
      legend: {
        display: false,
      },
      plugins: {
        datalabels: {
          color: '#000',
          anchor: 'end',
          align: 'end',
          formatter: (val) => val + '%',
          font: {
            size: 25,
            weight: 'bold',
          },
        },
        doughnutlabel: {
          labels: [
            {
              text: '\\nAvance General',
              font: {
                size: 20,
              },
            },
            {
              text: '\\n${avanceGeneral}%',
              color: '#000',
              font: {
                size: 40,
                weight: 'bold',
              },
            },
          ],
        },
      },
    },
  }`;

    let chartImage = "https://quickchart.io/chart?w=500&h=300&c=" + encodeURIComponent(chartStr);
    return chartImage;
  }

  graficoCircularTeam(valor: any) {
    let color = this.getBaseColor();

    let chartStr = `{
      type: 'pie',
      data: {
        datasets: [
          {
            data: [${valor}, ${100 - valor}],
            backgroundColor:['${color}', '#eaeaea'] ,
            label: 'Dataset 1',
            borderWidth: 0,
          },
        ],
        labels: ['Red', 'Orange'],
      },
      options: {
         legend: {
                display: false,
              },
        plugins: {
                datalabels: {
                  color: 'black',
                  formatter: (value, context)  =>  '',
                  font: {
                    size: 8,
                  },
                },
              }
      }
    }`;

    return "https://quickchart.io/chart?w=80&h=80&c=" + encodeURIComponent(chartStr);

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


    return "https://quickchart.io/chart?w=950&h=300&c=" + encodeURIComponent(chartStr);

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
