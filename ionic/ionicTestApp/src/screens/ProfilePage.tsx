import React, { useMemo } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSpinner,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import { useProfile } from '../hooks/useProfile';
import { PrijavljenTrening } from '../domain/models/Trening';


type Props = {
  userId: string;
};

export const ProfilePage: React.FC<Props> = ({ userId }) => {
  const { user: user, trainings, isLoading, isError, refetch } =
    useProfile(userId);

  const formattedDate = useMemo(() => {
    if (!user) return '';
    return user.datumRodenja.toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }, [user]);

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar style={{
      paddingTop: 32,    }}>
            <IonTitle>Moj profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div style={{ padding: 16, textAlign: 'center' }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (isError || !user) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar style={{
      paddingTop: 32,    }}>
            <IonTitle>Moj profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div style={{ padding: 16 }}>
            <IonText color="danger">
              Došlo je do greške pri učitavanju profila.
            </IonText>
            <div style={{ marginTop: 12 }}>
              <IonButton onClick={refetch}>Pokušaj ponovno</IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
      paddingTop: 32,    }}>
          <IonTitle>Moj profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Kartica s osnovnim podacima – slično Flutter cardu */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              {user.ime} {user.prezime}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <SectionLabel text="Datum rođenja" />
            <SectionValue text={formattedDate} />

            <Divider />

            <SectionLabel text="Tip članarine" />
            <SectionValue text={user.tipClanarine ?? 'Nije definirano'} />
          </IonCardContent>
        </IonCard>

        {/* Moji treninzi – slično TrainingsSection u Kotlin/Flutter/RN */}
        <div style={{ padding: '0 16px 16px 16px' }}>
          <h3 style={{ marginBottom: 8 }}>Moji treninzi</h3>

          {trainings.length === 0 && (
            <IonText color="medium">
              Još nemaš prijavljenih treninga.
            </IonText>
          )}

          {trainings.map((t) => (
            <TrainingCard key={t.naziv} trening={t} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

const SectionLabel: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      fontSize: 14,
      color: '#777',
      marginBottom: 4,
    }}
  >
    {text}
  </div>
);

const SectionValue: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 8,
    }}
  >
    {text}
  </div>
);

const Divider: React.FC = () => (
  <div
    style={{
      height: 1,
      backgroundColor: '#eee',
      margin: '8px 0',
    }}
  />
);

type TrainingCardProps = {
  trening: PrijavljenTrening;
};

const TrainingCard: React.FC<TrainingCardProps> = ({ trening }) => {
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
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{trening.naziv}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div>
          <strong>
            {dateStr} {timeStr}
          </strong>
        </div>
        <div>Dvorana: {trening.dvorana}</div>
        {trening.teretana && <div>Teretana: {trening.teretana}</div>}
      </IonCardContent>
    </IonCard>
  );
};
