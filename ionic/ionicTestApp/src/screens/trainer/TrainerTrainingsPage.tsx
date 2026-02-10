import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonList,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLoading,
  IonText,
  IonButton,
  IonIcon,
  IonFooter,
  useIonAlert,
} from '@ionic/react';
import { trashOutline, addOutline, calendarOutline } from 'ionicons/icons';

import { useTrainerTrainings } from '../../hooks/useTrainerTrainings';

export function TrainerTrainingsPage() {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const { trainings, isLoading, isError, refetch, deleteRaspored } =
    useTrainerTrainings();

  const confirmDelete = (rasporedId: string) => {
    presentAlert({
      header: 'Brisanje termina',
      message:
        'Jeste li sigurni da želite obrisati ovaj termin?',
      buttons: [
        { text: 'Odustani', role: 'cancel' },
        {
          text: 'Obriši',
          role: 'destructive',
          handler: async () => {
            try {
              await deleteRaspored(rasporedId);
            } catch (e: any) {
              presentAlert({
                header: 'Greška',
                message: e?.message ?? 'Brisanje termina nije uspjelo.',
                buttons: ['OK'],
              });
            }
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
      paddingTop: 32,    }}>
          <IonTitle>Moji treninzi</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading isOpen={isLoading} message="Loading..." />

        {isError ? (
          <div className="ion-padding">
            <IonText color="danger">Dogodila se greška.</IonText>
            <IonButton expand="block" onClick={refetch}>
              Pokušaj ponovno
            </IonButton>
          </div>
        ) : null}

        {!isLoading && !isError && trainings.length === 0 ? (
          <IonText className="ion-padding">Nema termina.</IonText>
        ) : null}

        <IonList>
          {trainings.map((t) => {
            const time = `${hm(t.pocetakVrijeme)} - ${hm(t.zavrsetakVrijeme)}`;
            return (
              <IonItem
                key={t.rasporedId}
                button
                detail
                onClick={() => history.push(`/trainer/attendees/${t.rasporedId}`)}
              >
                <IonLabel>
                  <h2>
                    {formatDate(t.pocetakVrijeme)} • {t.vrstaTreningaNaziv}
                  </h2>
                  <p>
                    {time} • {t.teretanaNaziv} • {t.dvoranaNaziv}
                  </p>
                </IonLabel>

                <IonButton
                  slot="end"
                  fill="clear"
                  color="danger"
                  aria-label="Obriši termin"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(t.rasporedId);
                  }}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>

      {/* Bottom buttons */}
      <IonFooter>
        <IonToolbar>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              padding: 10,
            }}
          >
            <IonButton
              expand="block"
              onClick={() => history.push('/trainer/create-trening')}
            >
              <IonIcon slot="start" icon={addOutline} />
              Novi trening
            </IonButton>

            <IonButton
              expand="block"
              onClick={() => history.push('/trainer/create-raspored')}
            >
              <IonIcon slot="start" icon={calendarOutline} />
              Novi termin
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}

function hm(iso: string) {
  const dt = new Date(iso);
  return `${String(dt.getHours()).padStart(2, '0')}:${String(dt
    .getMinutes())
    .padStart(2, '0')}`;
}

function formatDate(iso: string) {
  const dt = new Date(iso);
  return `${String(dt.getDate()).padStart(2, '0')}.${String(
    dt.getMonth() + 1
  ).padStart(2, '0')}.${dt.getFullYear()}.`;
}

