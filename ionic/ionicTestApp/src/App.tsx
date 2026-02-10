import React, { useEffect, useMemo, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonLabel,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { CreateTreningPage } from './screens/trainer/CreateTreningPage';
import { CreateRasporedPage } from './screens/trainer/CreateRasporedPage';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

import { AuthRepositoryImpl } from './data/supabase/repository/AuthRepositoryImpl';
import { UserRole } from './domain/repository/AuthRepository';

import { LoginPage } from './screens/LoginPage';

import { TrainingSelectionPage } from './screens/TrainingSelectionPage';
import { TrainingDetailsPage } from './screens/TrainingDetailsPage';
import { ProfilePage } from './screens/ProfilePage';

import { TrainerTrainingsPage } from './screens/trainer/TrainerTrainingsPage';
import { TrainerAttendeesPage } from './screens/trainer/TrainerAttendeesPage';
import { authRepository } from './hooks/configuration/repositories';

setupIonicReact();

const App: React.FC = () => {
  const authRepo = useMemo(() => authRepository, []);

  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
useEffect(() => {
  const boot = async () => {
    setLoading(true);
    try {
      await authRepo.signOut();

      setUserId(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  boot();
}, [authRepo]);
  const isAuthed = !!userId && !!role;

  return (
    <IonApp>
      <IonReactRouter>
        <IonLoading isOpen={isLoading} message="Loading..." />

        <IonRouterOutlet>
          <Route exact path="/login">
            {isAuthed ? (
              role === 'SPORTAS' ? (
                <Redirect to="/app/profile" />
              ) : (
                <Redirect to="/trainer/trainings" />
              )
            ) : (
              <LoginPage
                isLoading={isLoading}
                onLoginSuccess={async () => {
                  setLoading(true);
                  try {
                    const uid = await authRepo.getCurrentUserId();
                    if (!uid) return;
                    const r = await authRepo.getUserRole(uid);
                    setUserId(uid);
                    setRole(r);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            )}
          </Route>

          <Route path="/app">
            {!isAuthed ? (
              <Redirect to="/login" />
            ) : role === 'SPORTAS' ? (
              <SportasTabs userId={userId!} />
            ) : (
              <Redirect to="/trainer/trainings" />
            )}
          </Route>

          <Route path="/trainer">
            {!isAuthed ? (
              <Redirect to="/login" />
            ) : role === 'TRENER' ? (
              <TrainerTabs userId={userId!} />
            ) : (
              <Redirect to="/app/profile" />
            )}
          </Route>

          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

function SportasTabs({ userId }: { userId: string }) {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/profile">
          <ProfilePage userId={userId} />
        </Route>

        <Route exact path="/app/trainings">
          <TrainingSelectionPage userId={userId} />
        </Route>

        <Route exact path="/app/trainings/:treningId/:rasporedId">
          <TrainingDetailsPage userId={userId} />
        </Route>

        <Route exact path="/app">
          <Redirect to="/app/profile" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="profile" href="/app/profile">
          <IonLabel>Profil</IonLabel>
        </IonTabButton>

        <IonTabButton tab="trainings" href="/app/trainings">
          <IonLabel>Treninzi</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

function TrainerTabs({ userId }: { userId: string }) {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/trainer/trainings">
          <TrainerTrainingsPage userId={userId} />
        </Route>

        <Route exact path="/trainer/attendees/:rasporedId">
          <TrainerAttendeesPage userId={userId} />
        </Route>

        {/* NEW */}
        <Route exact path="/trainer/create-trening">
          <CreateTreningPage />
        </Route>

        {/* NEW */}
        <Route exact path="/trainer/create-raspored">
          <CreateRasporedPage />
        </Route>

        <Route exact path="/trainer">
          <Redirect to="/trainer/trainings" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="trainer-trainings" href="/trainer/trainings">
          <IonLabel>Moji treninzi</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
