import React, { useMemo } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  useIonRouter,
  IonButton,
} from '@ionic/react';

import { useTrainingSelection } from '../hooks/useTrainingSelection';
import { DostupniTrening, Teretana } from '../domain/models/Trening';

type Props = {
  userId: string;
};

export const TrainingSelectionPage: React.FC<Props> = ({ userId }) => {
  const {
    teretane,
    selectedTeretana,
    selectedDate,
    trainings,
    isLoading,
    error,
    changeDate,
    changeTeretana,
  } = useTrainingSelection(userId);

  const router = useIonRouter();

  const formattedDate = useMemo(
    () =>
      selectedDate.toLocaleDateString('hr-HR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    [selectedDate]
  );

  const selectedDateIso = useMemo(
    () => selectedDate.toISOString(),
    [selectedDate]
  );

  const handleDateChange = (value: string | null | undefined) => {
    if (!value) return;

    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      changeDate(d);
    }
  };

  const handleTeretanaChange = (id: string | null | undefined) => {
    if (!id) return;
    const t = teretane.find((x) => x.idTeretane === id);
    if (t) {
      changeTeretana(t);
    }
  };

  const openDetails = (t: DostupniTrening) => {
    router.push(
      `/app/trainings/${t.treningId}/${t.rasporedId}`,
      'forward',
      'push'
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
      paddingTop: 32,    }}>
          <IonTitle>Pretraga treninga</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* FILTRI – analogno RN: prvo datum, pa teretana */}
        <IonList>
          {/* Datum */}
          <IonItem>
            <IonLabel position="stacked">Datum</IonLabel>

            {/* prikaz odabranog datuma, kao label (kao RN Text) */}
            <div style={{ marginBottom: 8, fontSize: 16 }}>
              {formattedDate}
            </div>

            {/* inline calendar (možeš kasnije zamijeniti za modal, ali ovo je najjednostavnije) */}
            <IonDatetime
              presentation="date"
              value={selectedDateIso}
              onIonChange={(e) =>
                handleDateChange(e.detail.value as string | null)
              }
            />
          </IonItem>

          {/* Teretana */}
          <IonItem>
            <IonLabel position="stacked">Teretana</IonLabel>
            <IonSelect
              interface="popover"
              placeholder="Odaberi teretanu"
              value={selectedTeretana?.idTeretane}
              onIonChange={(e) =>
                handleTeretanaChange(e.detail.value as string | null)
              }
            >
              {teretane.map((t: Teretana) => (
                <IonSelectOption key={t.idTeretane} value={t.idTeretane}>
                  {t.nazivTeretane}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonList>

        {/* Loading / error / prazno – isto kao RN dio dolje */}
        {isLoading && (
          <div style={{ padding: 16, textAlign: 'center' }}>
            <IonSpinner />
          </div>
        )}

        {error && !isLoading && (
          <div style={{ padding: 16 }}>
            <IonText color="danger">{error}</IonText>
          </div>
        )}

        {!isLoading && trainings.length === 0 && !error && (
          <div style={{ padding: 16 }}>
            <IonText color="medium">
              Nema treninga za odabrani datum i teretanu.
            </IonText>
          </div>
        )}

        {/* Lista treninga – kao RN FlatList + TrainingCard */}
        {!isLoading &&
          trainings.map((t) => (
            <TrainingCard
              key={t.rasporedId}
              trening={t}
              onOpenDetails={() => openDetails(t)}
            />
          ))}
      </IonContent>
    </IonPage>
  );
};

type TrainingCardProps = {
  trening: DostupniTrening;
  onOpenDetails: () => void;
};

const TrainingCard: React.FC<TrainingCardProps> = ({
  trening,
  onOpenDetails,
}) => {
  const start = trening.pocetak;
  const end = trening.kraj;

  const dateStr = `${start.getDate().toString().padStart(2, '0')}.${(
    start.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}.${start.getFullYear()}.`;

  const timeStr =
    `${start.getHours().toString().padStart(2, '0')}:${start
      .getMinutes()
      .toString()
      .padStart(2, '0')}` +
    ' - ' +
    `${end.getHours().toString().padStart(2, '0')}:${end
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

  return (
    <IonCard button onClick={onOpenDetails}>
      <IonCardHeader>
        <IonCardTitle>{trening.nazivVrsteTreninga}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div>
          <strong>
            {dateStr} {timeStr}
          </strong>
        </div>
        <div>Dvorana: {trening.nazivDvorane}</div>
        {trening.nazivTeretane && (
          <div>Teretana: {trening.nazivTeretane}</div>
        )}
        <div>
          Trener: {trening.trenerIme} {trening.trenerPrezime}
        </div>
        <div>
          {trening.trenutnoPrijavljenih}/{trening.maxBrojSportasa} prijavljenih
        </div>
        {trening.isFull && (
          <IonText color="danger">Trening je pun</IonText>
        )}

        {/* opcionalno gumb, kao u RN kad ideš na details */}
        <div style={{ marginTop: 12 }}>
          <IonButton size="small" fill="outline" onClick={onOpenDetails}>
            Detalji
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};
