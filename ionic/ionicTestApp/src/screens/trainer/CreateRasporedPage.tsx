import React, { useMemo, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption,
  IonDatetime, IonButton, IonSpinner, useIonAlert
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useCreateRaspored } from "../../hooks/useCreateRaspored";

function toDate(value: string | string[] | null | undefined): Date | null {
  if (!value || Array.isArray(value)) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const CreateRasporedPage: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const { options, isLoading, isSaving, isError, submit } = useCreateRaspored();

  const [treningId, setTreningId] = useState<string>("");

  const [pocetakIso, setPocetakIso] = useState<string>(new Date().toISOString());
  const [zavrsetakIso, setZavrsetakIso] = useState<string>(
    new Date(Date.now() + 60 * 60 * 1000).toISOString()
  );

  const canSubmit = useMemo(() => {
    const p = new Date(pocetakIso).getTime();
    const z = new Date(zavrsetakIso).getTime();
    return !!treningId && z > p;
  }, [treningId, pocetakIso, zavrsetakIso]);

  const onSave = async () => {
    const pocetak = new Date(pocetakIso);
    const zavrsetak = new Date(zavrsetakIso);

    if (!canSubmit) {
      presentAlert({
        header: "Neispravno",
        message: "Provjeri odabir treninga i vremena (završetak mora biti nakon početka).",
        buttons: ["OK"],
      });
      return;
    }

    try {
      await submit({ treningId, pocetak, zavrsetak });
      presentAlert({ header: "Uspjeh", message: "Termin je kreiran.", buttons: ["OK"] });
      history.goBack();
    } catch (e: any) {
      presentAlert({ header: "Greška", message: e?.message ?? "Kreiranje termina nije uspjelo.", buttons: ["OK"] });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
      paddingTop: 32,    }}>
          <IonTitle>Novi termin</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
            <IonSpinner />
          </div>
        )}

        {isError && !isLoading && (
          <div style={{ padding: 16 }}>Dogodila se greška.</div>
        )}

        {!isLoading && !isError && (
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <IonItem>
              <IonLabel position="stacked">Trening</IonLabel>
              <IonSelect value={treningId} placeholder="Odaberi trening" onIonChange={(e) => setTreningId(e.detail.value)}>
                {options.map((o: any) => (
                  <IonSelectOption key={o.treningId} value={o.treningId}>
                    {o.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonItem lines="none">
              <IonLabel position="stacked">Početak</IonLabel>
              <IonDatetime
                value={pocetakIso}
                presentation="date-time"
                hourCycle="h23"
                onIonChange={(e) => {
                  const d = toDate(e.detail.value);
                  if (d) setPocetakIso(d.toISOString());
                }}
              />
            </IonItem>

            <IonItem lines="none">
              <IonLabel position="stacked">Završetak</IonLabel>
              <IonDatetime
                value={zavrsetakIso}
                presentation="date-time"
                hourCycle="h23"
                onIonChange={(e) => {
                  const d = toDate(e.detail.value);
                  if (d) setZavrsetakIso(d.toISOString());
                }}
              />
            </IonItem>

            <IonButton expand="block" disabled={!canSubmit || isSaving} onClick={onSave}>
              {isSaving ? "Spremam..." : "Spremi"}
            </IonButton>

            <IonButton expand="block" fill="clear" onClick={() => history.goBack()}>
              Odustani
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};
