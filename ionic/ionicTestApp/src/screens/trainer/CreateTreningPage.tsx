import React, { useMemo, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonInput,
  IonButton, IonSpinner, IonSegment, IonSegmentButton, useIonAlert
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useCreateTrening } from '../../hooks/useCreateTrening';

type Mode = "existing" | "new";

export const CreateTreningPage: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const { dvorane, vrste, isLoading, isSaving, isError, submit } = useCreateTrening();

  const [dvoranaId, setDvoranaId] = useState<string>("");
  const [mode, setMode] = useState<Mode>("existing");

  const [vrstaId, setVrstaId] = useState<string>("");
  const [novaVrstaNaziv, setNovaVrstaNaziv] = useState("");
  const [novaVrstaTezina, setNovaVrstaTezina] = useState<string>("");

  const [maks, setMaks] = useState<string>("20");

  const canSubmit = useMemo(() => {
    const maksNum = Number(maks);
    if (!dvoranaId) return false;
    if (!Number.isFinite(maksNum) || maksNum <= 0) return false;

    if (mode === "existing") return !!vrstaId;
    const tez = Number(novaVrstaTezina);
    return !!novaVrstaNaziv && Number.isFinite(tez);
  }, [dvoranaId, maks, mode, vrstaId, novaVrstaNaziv, novaVrstaTezina]);

  const onSave = async () => {
    try {
      await submit({
        dvoranaId,
        useExistingVrsta: mode === "existing",
        vrstaId: mode === "existing" ? vrstaId : undefined,
        novaVrstaNaziv: mode === "new" ? novaVrstaNaziv : undefined,
        novaVrstaTezina: mode === "new" ? Number(novaVrstaTezina) : undefined,
        maksBrojSportasa: Number(maks),
      });
      presentAlert({ header: "Uspjeh", message: "Trening je kreiran.", buttons: ["OK"] });
      history.goBack();
    } catch (e: any) {
      presentAlert({ header: "Greška", message: e?.message ?? "Kreiranje nije uspjelo.", buttons: ["OK"] });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{
      paddingTop: 32,    }}>
          <IonTitle>Novi trening</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
            <IonSpinner />
          </div>
        )}

        {isError && !isLoading && (
          <div style={{ padding: 16 }}>Dogodila se greška pri dohvaćanju podataka.</div>
        )}

        {!isLoading && !isError && (
          <div style={{ padding: 16, display: "grid", gap: 12 }}>
            <IonItem>
              <IonLabel position="stacked">Dvorana</IonLabel>
              <IonSelect
                value={dvoranaId}
                placeholder="Odaberi dvoranu"
                onIonChange={(e) => setDvoranaId(e.detail.value)}
              >
                {dvorane.map((d: any) => (
                  <IonSelectOption key={d.idDvorane} value={d.idDvorane}>
                    {d.nazivDvorane}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonSegment
              value={mode}
              onIonChange={(e) => {
                const v = e.detail.value;
                if (v === "existing" || v === "new") setMode(v);
              }}
            >
              <IonSegmentButton value="existing">
                <IonLabel>Postojeća vrsta</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="new">
                <IonLabel>Nova vrsta</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {mode === "existing" ? (
              <IonItem>
                <IonLabel position="stacked">Vrsta treninga</IonLabel>
                <IonSelect
                  value={vrstaId}
                  placeholder="Odaberi vrstu"
                  onIonChange={(e) => setVrstaId(e.detail.value)}
                >
                  {vrste.map((v: any) => (
                    <IonSelectOption key={v.idVrTreninga} value={v.idVrTreninga}>
                      {v.nazivVrTreninga} (Težina: {v.tezina})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            ) : (
              <>
                <IonItem>
                  <IonLabel position="stacked">Naziv vrste</IonLabel>
                  <IonInput
                    value={novaVrstaNaziv}
                    onIonInput={(e) => setNovaVrstaNaziv(e.detail.value ?? "")}
                    placeholder="npr. HIIT"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Težina</IonLabel>
                  <IonInput
                    value={novaVrstaTezina}
                    onIonInput={(e) => setNovaVrstaTezina(e.detail.value ?? "")}
                    inputmode="numeric"
                    placeholder="npr. 3"
                  />
                </IonItem>
              </>
            )}

            <IonItem>
              <IonLabel position="stacked">Maks. broj sportaša</IonLabel>
              <IonInput
                value={maks}
                onIonInput={(e) => setMaks(e.detail.value ?? "")}
                inputmode="numeric"
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
