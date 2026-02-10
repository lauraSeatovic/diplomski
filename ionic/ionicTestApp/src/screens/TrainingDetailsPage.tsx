import React from 'react';
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
  useIonRouter,
} from '@ionic/react';
import { useParams } from 'react-router-dom';

import { useTrainingDetails } from '../hooks/useTrainingDetails';
import { SignUpResult } from '../domain/models/common';

type RouteParams = {
  treningId: string;
  rasporedId: string;
};

type Props = {
  userId: string;
};

export const TrainingDetailsPage: React.FC<Props> = ({ userId }) => {
  const { treningId, rasporedId } = useParams<RouteParams>();
  const router = useIonRouter();

  const {
    details,
    isLoading,
    isSigningUp,
    error,
    reload,
    signUp,
  } = useTrainingDetails(treningId!, rasporedId!, userId);

  const handleSignUp = async () => {
    const result = await signUp();

    let message = '';
    switch (result) {
      case SignUpResult.Success:
        message = 'Uspješna prijava na trening';
        alert(message);
        router.back();
        return;
      case SignUpResult.UserAlreadySigned:
        message = 'Već si prijavljena na ovaj trening';
        break;
      case SignUpResult.TrainingFull:
        message = 'Trening je pun';
        break;
      default:
        message = 'Dogodila se greška prilikom prijave.';
    }

    alert(message);
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar style={{
      paddingTop: 32,    }}>
            <IonTitle>Detalji treninga</IonTitle>
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

  if (error || !details) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar style={{
      paddingTop: 32,    }}>
            <IonTitle>Detalji treninga</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div style={{ padding: 16 }}>
            <IonText color="danger">
              {error ?? 'Neuspješno učitavanje detalja treninga.'}
            </IonText>
            <div style={{ marginTop: 12 }}>
              <IonButton onClick={reload}>Pokušaj ponovno</IonButton>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
        style={{
      paddingTop: 32,    }}>
          <IonTitle>Detalji treninga</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{details.nazivVrste}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
  <div>
    <strong>Težina:</strong> {details.tezina}
  </div>

  <div style={{ marginTop: 20 }}>
    <IonButton
      expand="block"
      onClick={handleSignUp}
      disabled={isSigningUp}
    >
      {isSigningUp ? 'Prijava…' : 'Prijavi se na trening'}
    </IonButton>
  </div>
</IonCardContent>

        </IonCard>
      </IonContent>
    </IonPage>
  );
};
