import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SeancesService, Seance } from './seances.service';

describe('SeancesService', () => {
  let service: SeancesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SeancesService],
    });
    service = TestBed.inject(SeancesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('recupererSeances', () => {
    it('devrait retourner une séance', () => {
      // GIVEN
      const mockSeances: Seance[] = [
        {
          id: 1,
          label: 'Séance test',
          dateCreation: new Date('2025-10-17'),
          lieu: 'Salle test',
          description: 'Description test',
          idUtilisateur: null,
          exercice: null,
          categorie: null,
        },
      ];

      // WHEN

      service.recupererSeances().subscribe((seances) => {
        // THEN
        expect(seances).toEqual(mockSeances);
        expect(seances.length).toBe(1);
        expect(seances[0].label).toBe('Séance test');
      });

      // MOCK
      const req = httpTestingController.expectOne(
        'http://localhost:3000/seances'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSeances);
    });

    it('devrait renvoyer une réponse vide', () => {
      // GIVEN
      const mockEmptyResponse: Seance[] = [];

      // WHEN
      service.recupererSeances().subscribe((seances) => {
        // THEN
        expect(seances).toEqual([]);
        expect(seances.length).toBe(0);
      });

      // Simuler une réponse vide
      const req = httpTestingController.expectOne(
        'http://localhost:3000/seances'
      );
      req.flush(mockEmptyResponse);
    });

    it('devrait gérer les erreurs HTTP correctement', () => {
      // GIVEN
      // Aucune donnée spécifique à préparer

      // WHEN
      service.recupererSeances().subscribe({
        next: () => fail('devrait avoir échoué avec une erreur 500'),
        error: (error) => {
          // THEN
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        },
      });

      // MOCK
      const req = httpTestingController.expectOne(
        'http://localhost:3000/seances'
      );
      req.flush('Server Error', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('recupererUneSeance', () => {
    it('devrait retourner une séance spécifique par ID', () => {
      // GIVEN
      const mockSeance: Seance = {
        id: 1,
        label: 'Séance musculation',
        dateCreation: new Date('2025-10-17'),
        lieu: 'Salle de sport',
        description: 'Séance de musculation complète',
        idUtilisateur: null,
        exercice: null,
        categorie: null,
      };

      // WHEN
      service.recupererUneSeance(1).subscribe((seance) => {
        // THEN
        expect(seance).toEqual(mockSeance);
        expect(seance.id).toBe(1);
        expect(seance.label).toBe('Séance musculation');
      });

      // MOCK
      const req = httpTestingController.expectOne(
        'http://localhost:3000/seances/1'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSeance);
    });

    it("devrait appeler la bonne URL avec l'ID fourni", () => {
      // GIVEN
      const testId = 42;
      const mockSeance: Seance = {
        id: testId,
        label: 'Test séance',
        dateCreation: new Date(),
        lieu: 'Test lieu',
        description: 'Test description',
        idUtilisateur: null,
        exercice: null,
        categorie: null,
      };

      // WHEN
      service.recupererUneSeance(testId).subscribe();

      // THEN
      const req = httpTestingController.expectOne(
        `http://localhost:3000/seances/${testId}`
      );
      expect(req.request.url).toBe(`http://localhost:3000/seances/${testId}`);
      req.flush(mockSeance);
    });

    it('devrait gérer les erreurs 404 (séance non trouvée)', () => {
      // GIVEN
      const nonExistentId = 999;

      // WHEN
      service.recupererUneSeance(nonExistentId).subscribe({
        next: () => fail('devrait avoir échoué avec une erreur 404'),
        error: (error) => {
          // THEN
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
        },
      });

      // MOCK
      const req = httpTestingController.expectOne(
        `http://localhost:3000/seances/${nonExistentId}`
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
