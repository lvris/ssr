import {VscHome, VscVmConnect, VscServerProcess, VscCoffee} from "react-icons/vsc";
import Dock from "./Dock"

const HomepageDock = () =>
{
  const items =
  [
    {icon: <VscHome size={32} color={"#6cdef0ff"}/>, label: "Home", onClick: () => goToPage("") },
    {icon: <VscVmConnect size={32} color={"#94c2ffff"}/>, label: "CSR Page", onClick: () => goToPage("csr") },
    {icon: <VscServerProcess size={32} color={"#4e89f7ff"}/>, label: "SSR Page", onClick: () => goToPage("ssr")},
    {icon: <VscCoffee size={32} color={"#0011f8ff"}/>, label: "Another Link To Homepage", onClick: () => goToPage("")},
  ];

  return (
    <Dock
      items={items}
      spring={{damping: 0, stiffness: 0, restDelta: 0}}
      magnification={70}
      panelHeight={68}
      baseItemSize={50}
    />
  );
}

function goToPage(path = "")
{
  window.location.href = "/" + path;
}

export default HomepageDock
