"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, CheckCircle, AlertCircle, Users } from "lucide-react";
import { Button } from "@/components/gruempi/ui/Button";
import { Input } from "@/components/gruempi/ui/Input";
import { Select } from "@/components/gruempi/ui/Select";
import { registerTeam, registrationSchema } from "@/lib/gruempi/actions/registration";

type FormData = z.infer<typeof registrationSchema>;

interface Props {
  categories: { id: string; name: string }[];
  tournamentTeamSize: number;
}

const currentYear = new Date().getFullYear();

export function RegistrationForm({ categories, tournamentTeamSize }: Props) {
  const [result, setResult] = useState<
    { success: true; teamName: string } | { success: false; error: string } | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: "",
      categoryId: "",
      captainName: "",
      captainEmail: "",
      captainPhone: "",
      notes: "",
      players: [{ name: "", birthYear: currentYear - 8 }],
      acceptDataPrivacy: undefined,
      acceptTerms: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "players" });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await registerTeam(data);
      setResult(res);
      if (res.success) reset();
    } catch {
      setResult({ success: false, error: "Ein unerwarteter Fehler ist aufgetreten." });
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <div className="bg-primary-50 border border-primary-200 rounded-2xl p-8 text-center">
        <CheckCircle size={48} className="text-primary-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary-800 mb-2">
          Anmeldung erfolgreich! 🎉
        </h2>
        <p className="text-primary-700 text-lg mb-2">
          Team <strong>«{result.teamName}»</strong> ist angemeldet.
        </p>
        <p className="text-primary-600 text-sm leading-relaxed">
          Vielen Dank für eure Anmeldung! Ihr erhaltet eine Bestätigung sobald eure Anmeldung
          geprüft wurde. Fragen? sandrozwyssig@gmail.com
        </p>
        <button
          onClick={() => setResult(null)}
          className="mt-6 text-sm text-primary-600 underline hover:text-primary-800"
        >
          Weiteres Team anmelden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {result && !result.success && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{result.error}</p>
        </div>
      )}

      {/* Team info */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary-700 text-white text-sm flex items-center justify-center font-bold">
            1
          </span>
          Team-Informationen
        </h2>

        <Input
          label="Teamname"
          required
          placeholder="z. B. FC Staffeln Stars"
          error={errors.teamName?.message}
          {...register("teamName")}
        />

        <Select
          label="Kategorie"
          required
          placeholder="Bitte wählen..."
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          error={errors.categoryId?.message}
          {...register("categoryId")}
        />
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary-700 text-white text-sm flex items-center justify-center font-bold">
            2
          </span>
          Kontaktperson / Captain
        </h2>

        <Input
          label="Name"
          required
          placeholder="Vor- und Nachname"
          error={errors.captainName?.message}
          {...register("captainName")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="E-Mail"
            type="email"
            required
            placeholder="name@beispiel.ch"
            error={errors.captainEmail?.message}
            {...register("captainEmail")}
          />
          <Input
            label="Telefon"
            type="tel"
            required
            placeholder="079 123 45 67"
            error={errors.captainPhone?.message}
            {...register("captainPhone")}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Bemerkungen <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Besondere Hinweise, Fragen..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-y"
            {...register("notes")}
          />
          {errors.notes && <p className="text-xs text-red-600">{errors.notes.message}</p>}
        </div>
      </div>

      {/* Players */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary-700 text-white text-sm flex items-center justify-center font-bold">
              3
            </span>
            Kinder ({fields.length}/{tournamentTeamSize})
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ name: "", birthYear: currentYear - 8 })}
            disabled={fields.length >= 8}
          >
            <Plus size={16} />
            Kind hinzufügen
          </Button>
        </div>

        <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 flex items-start gap-2">
          <Users size={16} className="text-accent-600 shrink-0 mt-0.5" />
          <p className="text-xs text-accent-700">
            <strong>Nur Kinder aus Hermetschwil-Staffeln.</strong> Teams bestehen aus{" "}
            {tournamentTeamSize} Kindern (5 auf dem Feld + 1 Auswechselspieler).
          </p>
        </div>

        {errors.players && !Array.isArray(errors.players) && (
          <p className="text-sm text-red-600">{errors.players.message}</p>
        )}

        <div className="space-y-3">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
            >
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-bold shrink-0 mt-2">
                {idx + 1}
              </span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Name"
                  required
                  placeholder="Vorname Nachname"
                  error={(errors.players as { [k: number]: { name?: { message?: string } } })?.[idx]?.name?.message}
                  {...register(`players.${idx}.name`)}
                />
                <Input
                  label="Jahrgang"
                  type="number"
                  required
                  placeholder={String(currentYear - 8)}
                  error={(errors.players as { [k: number]: { birthYear?: { message?: string } } })?.[idx]?.birthYear?.message}
                  {...register(`players.${idx}.birthYear`, { valueAsNumber: true })}
                />
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-6"
                  aria-label="Kind entfernen"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Consent */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary-700 text-white text-sm flex items-center justify-center font-bold">
            4
          </span>
          Zustimmung
        </h2>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            value="true"
            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 shrink-0"
            {...register("acceptDataPrivacy")}
          />
          <span className="text-sm text-gray-700">
            Ich habe die{" "}
            <a
              href="/gruempi/datenschutz"
              target="_blank"
              className="text-primary-600 underline hover:text-primary-800"
            >
              Datenschutzerklärung
            </a>{" "}
            gelesen und stimme der Verarbeitung meiner Daten zum Zweck der Turnierorganisation zu.
            <span className="text-red-500 ml-0.5">*</span>
          </span>
        </label>
        {errors.acceptDataPrivacy && (
          <p className="text-xs text-red-600 ml-7">{errors.acceptDataPrivacy.message}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            value="true"
            className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 shrink-0"
            {...register("acceptTerms")}
          />
          <span className="text-sm text-gray-700">
            Ich habe die{" "}
            <a
              href="/gruempi/teilnahmebedingungen"
              target="_blank"
              className="text-primary-600 underline hover:text-primary-800"
            >
              Teilnahmebedingungen
            </a>{" "}
            gelesen und akzeptiere diese.
            <span className="text-red-500 ml-0.5">*</span>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-xs text-red-600 ml-7">{errors.acceptTerms.message}</p>
        )}
      </div>

      <Button type="submit" size="xl" fullWidth loading={submitting}>
        Team anmelden
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Startgeld CHF 30.– wird nach Bestätigung der Anmeldung fällig.
      </p>
    </form>
  );
}
