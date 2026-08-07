import { useEffect, useState } from "react";
import { newsletterService } from "../../services/newsletterService";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    newsletterService
      .getSubscribers()
      .then((data) => setSubscribers(data.results || data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-display">
        Newsletter Subscribers
      </h1>

      <div className="overflow-hidden rounded-lg border border-gold/20 bg-white">
        <table className="min-w-full">
          <thead className="bg-cream">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Subscribed On</th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t">
                <td className="px-6 py-4">{subscriber.email}</td>

                <td className="px-6 py-4">
                  {subscriber.is_active ? (
                    <span className="rounded bg-green-100 px-2 py-1 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="rounded bg-red-100 px-2 py-1 text-red-700">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    subscriber.subscribed_at
                  ).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}