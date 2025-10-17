import { Component, OnInit } from '@angular/core';
import { SeancesService } from '../../shared/services/seances.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: false,
})
export class DashboardComponent implements OnInit {
  constructor(private seancesService: SeancesService) {}

  ngOnInit() {
    this.seancesService.recupererSeances().subscribe((seances) => {
      console.log(seances);
    });
  }
}
