import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { trpc } from "../../lib/trpc";

const EMPTY_FORM = { fullName: "", phone: "", city: "", message: "" };

/**
 * "Être mis en relation" form. Same modal is reused across all 7 verticals —
 * only `categoryId` / `listingId` / `contextLabel` change per call site.
 * Intentionally has no pricing/booking fields: this phase is catalogue +
 * lead capture only, matching the scope decided for v1.
 */
export function RequestFormModal({ isOpen, onClose, categoryId, listingId, contextLabel }) {
  // categoryId / listingId are both optional: a general Contact-page
  // inquiry has neither, a CategoryPage request has only categoryId, and a
  // ListingDetail request has both.
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const createRequest = trpc.requests.create.useMutation({
    onSuccess: () => setIsSuccess(true),
  });

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate() {
    const nextErrors = {};
    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = "Merci d'indiquer votre nom complet.";
    }
    if (!/^[0-9+ ]{6,}$/.test(form.phone.trim())) {
      nextErrors.phone = "Numéro de téléphone invalide.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    createRequest.mutate({
      categoryId,
      listingId,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      city: form.city.trim() || undefined,
      message: form.message.trim() || undefined,
    });
  }

  function handleClose() {
    onClose();
    // Reset after the close animation would run, so the modal doesn't
    // visibly flash back to the empty form while still visible.
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setErrors({});
      setIsSuccess(false);
      createRequest.reset();
    }, 200);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Être mis en relation">
      {isSuccess ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CheckCircle2 className="h-10 w-10 text-brand-600" aria-hidden="true" />
          <p className="font-medium text-gray-900">Demande envoyée</p>
          <p className="text-sm text-gray-500">
            Un agent Nexova vous contactera très prochainement au numéro fourni.
          </p>
          <Button onClick={handleClose} className="mt-2">
            Fermer
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {contextLabel && (
            <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {contextLabel}
            </p>
          )}
          <Input
            label="Nom complet"
            required
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange("fullName")}
            error={errors.fullName}
          />
          <Input
            label="Téléphone"
            required
            type="tel"
            autoComplete="tel"
            placeholder="+224 6XX XX XX XX"
            value={form.phone}
            onChange={handleChange("phone")}
            error={errors.phone}
          />
          <Input
            label="Ville"
            autoComplete="address-level2"
            value={form.city}
            onChange={handleChange("city")}
          />
          <Textarea
            label="Message (optionnel)"
            placeholder="Précisez votre besoin…"
            value={form.message}
            onChange={handleChange("message")}
          />

          {createRequest.isError && (
            <p role="alert" className="text-sm text-red-600">
              L'envoi a échoué. Merci de réessayer.
            </p>
          )}

          <Button type="submit" isLoading={createRequest.isPending} className="mt-1">
            Envoyer la demande
          </Button>
        </form>
      )}
    </Modal>
  );
}
