import { repositoryEvidence } from "./repositories";

/** Exact, contiguous excerpts checked against the local checkout used for 6R. */
export const hangarSnippets = {
  workflow: {
    id: "workflow",
    title: "Reintentos por actividad",
    context: "Temporal configura timeout y reintentos antes de invocar las actividades. Son valores de configuración, no tiempos de despliegue medidos.",
    file: "api/internal/workflows/deploy_workflow.go",
    startLine: 36,
    endLine: 44,
    code: "\tao := workflow.ActivityOptions{\n\t\tStartToCloseTimeout: 10 * time.Minute,\n\t\tRetryPolicy: &temporal.RetryPolicy{\n\t\t\tMaximumAttempts:    3,\n\t\t\tInitialInterval:    5 * time.Second,\n\t\t\tBackoffCoefficient: 2.0,\n\t\t},\n\t}\n\tctx = workflow.WithActivityOptions(ctx, ao)",
    source: repositoryEvidence("hangar", "api/internal/workflows/deploy_workflow.go").source + "#L36-L44",
  },
  container: {
    id: "container",
    title: "Recursos y red en la creación del contenedor",
    context: "Estos argumentos de ContainerCreate fijan memoria y CPU, y conectan el contenedor a la red de la aplicación. La red compartida de Traefik se añade después.",
    file: "api/internal/activities/deploy_activities.go",
    startLine: 185,
    endLine: 197,
    code: "\t\t&containertypes.HostConfig{\n\t\t\tResources: containertypes.Resources{\n\t\t\t\tMemory:    128 * 1024 * 1024, // 128 MB\n\t\t\t\tCPUPeriod: 100000,\n\t\t\t\tCPUQuota:  25000,             // 25% de un core\n\t\t\t},\n\t\t\tRestartPolicy: containertypes.RestartPolicy{Name: \"unless-stopped\"},\n\t\t},\n\t\t&networktypes.NetworkingConfig{\n\t\t\tEndpointsConfig: map[string]*networktypes.EndpointSettings{\n\t\t\t\tappNetwork: {},\n\t\t\t},\n\t\t},",
    source: repositoryEvidence("hangar", "api/internal/activities/deploy_activities.go").source + "#L185-L197",
  },
  websocket: {
    id: "websocket",
    title: "Suscripción a logs por despliegue",
    context: "El handler se suscribe al canal del deployment y prepara la consulta periódica de estado. El historial ya se ha leído antes: esta secuencia no garantiza una transición sin pérdidas.",
    file: "api/internal/handler/ws.go",
    startLine: 90,
    endLine: 105,
    code: "\t// -- 2. Suscribe al canal Redis para logs en vivo --------------------\n\tchannel := rdb.LogChannel(deploymentID)\n\tpubsub := h.redis.Subscribe(ctx, channel)\n\tdefer pubsub.Close()\n\n\th.log.Info(\"suscrito a redis\",\n\t\tzap.String(\"channel\", channel),\n\t\tzap.String(\"deployment_id\", deploymentID),\n\t)\n\n\t// -- 3. Reenvía mensajes en tiempo real ----------------------------─\n\tmsgChan := pubsub.Channel()\n\n\t// Ticker para verificar si el deployment terminó\n\t// (por si el mensaje de \"done\" se perdió)\n\tstatusTicker := time.NewTicker(3 * time.Second)",
    source: repositoryEvidence("hangar", "api/internal/handler/ws.go").source + "#L90-L105",
  },
} as const;
