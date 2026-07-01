import { useState, useEffect, useMemo } from 'react'
import { Table, Badge, Button, Form } from 'react-bootstrap'
import { getLogs } from '../api'
import PageHeader from '../components/PageHeader'

const libellesAction = {
  emploi_du_temps: 'Emploi du temps',
  absences: 'Absences',
  notes: 'Notes',
  support: 'Support',
  stats: 'Stats admin',
  export: 'Export admin',
  alert: 'Alerte admin',
  ticket_create: 'Ticket créé',
  ticket_bouton: 'Clic bouton ticket',
  ping: 'Ping',
}

function libelleAction(action) {
  return libellesAction[action] || action || '—'
}

function Logs() {
  const [logs, setLogs] = useState([])
  const [filtre, setFiltre] = useState('Tous')
  const [recherche, setRecherche] = useState('')
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const charger = async () => {
    setChargement(true)
    setErreur('')
    try {
      const data = await getLogs()
      if (data.error) {
        setErreur(data.error)
        setLogs([])
      } else {
        setLogs(Array.isArray(data) ? data : [])
      }
    } catch {
      setErreur('Impossible de charger les logs.')
    } finally {
      setChargement(false)
    }
  }

  useEffect(() => {
    charger()
  }, [])

  const actions = useMemo(() => {
    const uniques = [...new Set(logs.map(l => l.action).filter(Boolean))]
    return uniques.sort()
  }, [logs])

  const logsFiltres = logs.filter(log => {
    if (filtre !== 'Tous' && log.action !== filtre) return false
    if (!recherche.trim()) return true
    const q = recherche.toLowerCase()
    return (
      String(log.action || '').toLowerCase().includes(q) ||
      String(log.details || '').toLowerCase().includes(q)
    )
  })

  return (
    <div className="page">
      <PageHeader title="Journal d'activité" subtitle={`${logs.length} entrée(s)`}>
        <Button variant="outline-primary" size="sm" onClick={charger} disabled={chargement}>
          {chargement ? 'Chargement...' : 'Actualiser'}
        </Button>
      </PageHeader>

      <div className="filter-bar">
        <Button
          variant={filtre === 'Tous' ? 'primary' : 'outline-secondary'}
          size="sm"
          onClick={() => setFiltre('Tous')}
        >
          Tous ({logs.length})
        </Button>
        {actions.map(action => (
          <Button
            key={action}
            variant={filtre === action ? 'primary' : 'outline-secondary'}
            size="sm"
            onClick={() => setFiltre(action)}
          >
            {libelleAction(action)} ({logs.filter(l => l.action === action).length})
          </Button>
        ))}
      </div>

      <Form.Control
        type="search"
        placeholder="Rechercher..."
        className="filter-search"
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
      />

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="admin-card card">
        <div className="card-body p-0">
          {chargement ? (
            <div className="empty-state">Chargement des logs...</div>
          ) : logsFiltres.length === 0 ? (
            <div className="empty-state">Aucun log trouvé.</div>
          ) : (
            <div className="table-wrap">
              <Table hover className="mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>ID Discord</th>
                  </tr>
                </thead>
                <tbody>
                  {logsFiltres.map((log, index) => (
                    <tr key={log.id ?? `${log.date_creation}-${index}`}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {log.date_creation
                          ? new Date(log.date_creation).toLocaleString('fr-FR')
                          : '—'}
                      </td>
                      <td>
                        <Badge bg="info" text="dark">
                          {libelleAction(log.action)}
                        </Badge>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Logs
