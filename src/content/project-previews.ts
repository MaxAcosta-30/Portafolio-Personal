import { hangarCaseStudy } from "./hangar-case-study";
import { taskFlowCaseStudy } from "./taskflow-case-study";

/** Exact contiguous excerpts from the public revisions approved by the owner. */
export const projectPreviews = {
  hangar: {
    file: "api/internal/workflows/deploy_workflow.go",
    startLine: 36,
    endLine: 44,
    source: "https://github.com/MaxAcosta-30/Setup-hangar/blob/62f02735668eb66e65a06041eb4277525399f174/api/internal/workflows/deploy_workflow.go#L36-L44",
    code: "\tao := workflow.ActivityOptions{\n\t\tStartToCloseTimeout: 10 * time.Minute,\n\t\tRetryPolicy: &temporal.RetryPolicy{\n\t\t\tMaximumAttempts:    3,\n\t\t\tInitialInterval:    5 * time.Second,\n\t\t\tBackoffCoefficient: 2.0,\n\t\t},\n\t}\n\tctx = workflow.WithActivityOptions(ctx, ao)",
    language: "Go",
    diagramLabel: hangarCaseStudy.architecture.controlTitle,
    nodes: hangarCaseStudy.architecture.control.slice(1),
  },
  "taskflow-pro": {
    file: "lib/socket/publisher.ts",
    startLine: 7,
    endLine: 16,
    source: "https://github.com/MaxAcosta-30/Taskflow-pro/blob/9b8a54b9c89a8f7d1b7e8ddc29e6d47a347c1c79/lib/socket/publisher.ts#L7-L16",
    code: "import { redis } from '@/lib/redis'\nimport type { SocketEvents } from '@/types'\n\nexport async function publishToBoard<K extends keyof SocketEvents>(\n  boardId: string,\n  event: K,\n  data: SocketEvents[K],\n): Promise<void> {\n  await redis.publish(`board:${boardId}`, JSON.stringify({ event, data }))\n}",
    language: "TypeScript",
    diagramLabel: taskFlowCaseStudy.architecture.requestTitle,
    nodes: taskFlowCaseStudy.architecture.request,
  },
} as const;

