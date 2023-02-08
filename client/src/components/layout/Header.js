import TCLogo from '../../resources/images/tc-logo-white.png';
import '../../resources/styles/layout/header.css';

export default function Header() {
  return (
    <header className='header'>
      <div className='logo-container'>
        <img src={TCLogo} alt='Thiscord logo' />
      </div>
      <h1>Thiscord</h1>
    </header>
  )
}
