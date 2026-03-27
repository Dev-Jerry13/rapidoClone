import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">RapidoClone</h1>
      <p className="mt-3 text-slate-300">Role-based ride hailing platform starter.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/login" className="rounded bg-white px-4 py-2 text-black">Login</Link>
        <Link href="/register" className="rounded border border-slate-700 px-4 py-2">Register</Link>
      </div>
    </main>
  );
}
