import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getMe } from '../api'

const ERROR_MESSAGES = {
  not_member: "Vous n'êtes pas membre du serveur Discord Ingetis.",
  not_admin: "Accès réservé aux membres avec le rôle équipe ou Admin.",
  invalid_state: "Session expirée. Veuillez réessayer.",
  token_exchange: "Échec de l'authentification Discord.",
  user_fetch: "Impossible de récupérer votre profil Discord.",
  oauth_not_configured: "OAuth Discord non configuré côté serveur.",
  server_error: "Erreur serveur lors de la connexion.",
  missing_params: "Paramètres de connexion manquants.",
  access_denied: "Connexion annulée.",
}

function AuthCallback({ onLogin }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      const error = params.get('error')
      const token = params.get('token')

      if (error) {
        const message = ERROR_MESSAGES[error] || 'Erreur de connexion.'
        navigate(`/?error=${encodeURIComponent(message)}`, { replace: true })
        return
      }

      if (!token) {
        navigate('/?error=' + encodeURIComponent('Token manquant.'), { replace: true })
        return
      }

      localStorage.setItem('token', token)

      try {
        const data = await getMe()
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        onLogin()
        navigate('/', { replace: true })
      } catch {
        localStorage.removeItem('token')
        navigate('/?error=' + encodeURIComponent('Session invalide.'), { replace: true })
      }
    }

    run()
  }, [params, navigate, onLogin])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
    }}>
      <p className="text-muted">Connexion en cours...</p>
    </div>
  )
}

export default AuthCallback
