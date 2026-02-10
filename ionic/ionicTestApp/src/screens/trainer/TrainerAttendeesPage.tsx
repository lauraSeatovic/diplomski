import React from 'react';
import { useParams } from 'react-router-dom';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';

import { useTrainerAttendees } from '../../hooks/useTrainerAttendees';

export function TrainerAttendeesPage() {
  const { rasporedId } = useParams<{ rasporedId: string }>();

  const {
    attendees,
    pending,
    isEditMode,
    isLoading,
    isSaving,
    isError,
    refetch,
    enterEditMode,
    cancelEditMode,
    toggle,
    submit,
  } = useTrainerAttendees(rasporedId);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sudionici</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonLoading
          isOpen={isLoading || isSaving}
          message={isSaving ? 'Spremanje...' : 'Učitavanje...'}
        />

        {isError ? (
          <div className="ion-padding">
            <IonText color="danger">Dogodila se greška.</IonText>
            <IonButton expand="block" onClick={refetch}>
              Pokušaj ponovno
            </IonButton>
          </div>
        ) : null}

        {!isLoading && !isError && attendees.length === 0 ? (
          <IonText className="ion-padding">Nema prijavljenih.</IonText>
        ) : null}

        <IonList>
          {attendees.map((a) => {
            const value = isEditMode
              ? pending[a.sportasId] ?? a.dolazakNaTrening
              : a.dolazakNaTrening;

            return (
              <IonItem key={a.sportasId}>
                <IonLabel>
                  <h2>
                    {a.ime} {a.prezime}
                  </h2>
                  <p>Ocjena: {a.ocjenaTreninga ?? '-'}</p>
                  <p>Status: {value ? 'Prisutan' : 'Nije prisutan'}</p>
                </IonLabel>

                {isEditMode ? (
                  <IonCheckbox
                    slot="end"
                    checked={value}
                    onIonChange={(e) =>
                      toggle(a.sportasId, !!e.detail.checked)
                    }
                  />
                ) : null}
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>

      {/* ✅ FIXED ACTION BAR AT THE BOTTOM */}
      <IonFooter>
        <div
          style={{
            display: 'flex',
            gap: 12,
            padding: 12,
          }}
        >
          {!isEditMode ? (
            <IonButton expand="block" onClick={enterEditMode}>
              Označi prisutnost
            </IonButton>
          ) : (
            <>
              <IonButton expand="block" fill="outline" onClick={cancelEditMode}>
                Odustani
              </IonButton>
              <IonButton expand="block" onClick={submit} disabled={isSaving}>
                Potvrdi
              </IonButton>
            </>
          )}
        </div>
      </IonFooter>
    </IonPage>
  );
}
