function Header() {
  return (
    <header className="flex min-h-40">
      <div className="flex w-64 items-center justify-center">
        <span>Logo</span>
      </div>

      <div className="flex w-[1100px] items-center justify-center">
        <h1 className="text-3xl font-bold">
          Données météorologiques canadiennes
        </h1>
      </div>
    </header>
  );
}

export default Header;