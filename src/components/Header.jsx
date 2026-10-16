import logo from "../assets/logo.svg";

// T1.1 : en-tête avec logo (en haut à gauche) et bannière de bienvenue
function Header() {
  return (
    <header className="flex min-h-40">
      <div className="flex w-64 items-center justify-center">
        <img src={logo} alt="Logo de l'application météo" className="h-28 w-28" />
      </div>

      <div className="flex w-[1100px] flex-col items-center justify-center bg-linear-to-r from-blue-700 to-sky-500 text-white">
        <h1 className="text-3xl font-bold">
          Bienvenue ! Données météo historiques canadiennes
        </h1>
        <p className="mt-2">
          Consultez l'historique météo des principaux aéroports internationaux du Canada
        </p>
      </div>
    </header>
  );
}

export default Header;
