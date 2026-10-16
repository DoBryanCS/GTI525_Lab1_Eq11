// T1.2 : pied de page avec les coordonnées de l'équipe
const TEAM_MEMBERS = [
  { name: "Khoa Do", email: "khoa-nguyen.do.1@ens.etsmtl.ca" },
  { name: "Mattias Gasparello", email: "Mattias.gasparello.1@ens.etsmtl.ca" },
  { name: "Javen Vernet", email: "javen.vernet.1@ens.etsmtl.ca" },
  { name: "Antoine Lamoureux", email: "Antoine.lamoureux.2@ens.etsmtl.ca" },
];

function Footer() {
  return (
    <footer className="py-6 text-center">
      <p className="font-bold">GTI525 — Équipe 11</p>
      {TEAM_MEMBERS.map((member) => (
        <p key={member.email}>
          {member.name} — <a className="text-blue-700 underline" href={`mailto:${member.email}`}>{member.email}</a>
        </p>
      ))}
    </footer>
  );
}

export default Footer;
