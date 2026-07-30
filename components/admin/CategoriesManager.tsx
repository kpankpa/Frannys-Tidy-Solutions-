"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import {
  createCategoryAction,
  deleteCategoryAction,
  renameCategoryAction,
} from "@/server/products";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

const fieldClass =
  "mt-1.5 w-full rounded-[8px] border border-border px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10";

export function CategoriesManager({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function refresh() {
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        className="rounded-[10px] border border-border bg-surface p-5 shadow-sm"
        action={(formData) => {
          setError("");
          setMessage("");
          startTransition(async () => {
            const result = await createCategoryAction(formData);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            setMessage("Category created.");
            refresh();
          });
        }}
      >
        <h2 className="font-bold">Add category</h2>
        <p className="mt-1 text-sm text-muted">
          Categories appear in the shop filters and product form.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              required
              placeholder="e.g. Floor Care"
              className={fieldClass}
            />
          </label>
          <Button type="submit" disabled={pending} className="sm:mb-0.5">
            {pending ? "Saving..." : "Add category"}
          </Button>
        </div>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        {message ? <p className="mt-3 text-sm text-success">{message}</p> : null}
      </form>

      <div className="overflow-hidden rounded-[10px] border border-border bg-surface shadow-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-surface-muted text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <form
                    className="flex flex-wrap items-end gap-2"
                    action={(formData) => {
                      setError("");
                      startTransition(async () => {
                        const result = await renameCategoryAction(formData);
                        if (!result.ok) {
                          setError(result.error);
                          return;
                        }
                        setMessage("Category renamed.");
                        refresh();
                      });
                    }}
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <label className="block min-w-[12rem] flex-1">
                      <span className="sr-only">Rename {category.name}</span>
                      <input
                        name="name"
                        required
                        defaultValue={category.name}
                        className="w-full rounded-[8px] border border-border px-3 py-2 text-sm"
                      />
                      <span className="mt-1 block text-xs text-muted">
                        /{category.slug}
                      </span>
                    </label>
                    <button
                      type="submit"
                      disabled={pending}
                      className="mb-5 text-xs font-semibold text-primary hover:underline disabled:opacity-60"
                    >
                      Rename
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">{category.productCount}</td>
                <td className="px-4 py-3">
                  {category.productCount > 0 ? (
                    <span className="text-xs text-muted">
                      Move products first
                    </span>
                  ) : (
                    <ConfirmDeleteButton
                      action={async (formData) => {
                        const result = await deleteCategoryAction(formData);
                        if (!result.ok) {
                          setError(result.error);
                          return;
                        }
                        setMessage("Category deleted.");
                        refresh();
                      }}
                      hiddenFields={{ id: category.id }}
                      confirmMessage={`Delete category ${category.name}?`}
                    />
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-muted">
                  No categories yet. Add one above.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
