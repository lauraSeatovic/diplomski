import React, { useMemo, useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonLoading,
} from '@ionic/react';

import { AuthRepositoryImpl } from '../data/supabase/repository/AuthRepositoryImpl';
import { authRepository } from '../hooks/configuration/repositories';

export function LoginPage({
  onLoginSuccess,
  isLoading,
}: {
  onLoginSuccess: () => Promise<void>;
  isLoading: boolean;
}) {
  const authRepo = useMemo(() => authRepository, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async () => {
    setErrorMessage(null);
    try {
      await authRepo.signIn(email.trim(), password);
      await onLoginSuccess();
    } catch (e: any) {
      setErrorMessage(e?.message ?? String(e));
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
      paddingTop: 32,    }}>
          <IonTitle>Prijava</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
  <IonLoading isOpen={isLoading} message="Signing in..." />

  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      maxWidth: 400,
      margin: '0 auto',
    }}
  >
    <IonItem>
      <IonLabel position="stacked">Email</IonLabel>
      <IonInput
        value={email}
        type="email"
        autocapitalize="off"
        onIonChange={(e) => setEmail(e.detail.value ?? '')}
      />
    </IonItem>

    <IonItem>
      <IonLabel position="stacked">Lozinka</IonLabel>
      <IonInput
        value={password}
        type="password"
        onIonChange={(e) => setPassword(e.detail.value ?? '')}
      />
    </IonItem>

    <div style={{ marginTop: 16 }}>
      <IonButton expand="block" onClick={submit} disabled={isLoading}>
        Prijavi se
      </IonButton>
    </div>

    {errorMessage ? (
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <IonText color="danger">{errorMessage}</IonText>
      </div>
    ) : null}
  </div>
</IonContent>

    </IonPage>
  );
}
