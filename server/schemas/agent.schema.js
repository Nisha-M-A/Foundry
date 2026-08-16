const { z } = require('zod');

const productManagerSchema = z.object({
  title: z.string(),
  summary: z.string(),
  tasks: z.array(z.string()),
  blueprint: z.object({
    type: z.literal('mindmap'),
    center: z.string(),
    branches: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        children: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        ).optional(),
      })
    ),
  }).nullable().optional(),
});

const systemArchitectSchema = z.object({
  summary: z.string(),
  tasks: z.array(z.string()),
  blueprint: z.object({
    type: z.literal('architecture'),
    components: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    ),
    connections: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
      })
    ),
  }).nullable().optional(),
});

const uiDesignerSchema = z.object({
  summary: z.string(),
  tasks: z.array(z.string()),
  blueprint: z.object({
    type: z.literal('wireframe'),
    screens: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        components: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
          })
        ),
      })
    ),
  }).nullable().optional(),
});

const backendEngineerSchema = z.object({
  summary: z.string(),
  tasks: z.array(z.string()),
  blueprint: z.object({
    type: z.literal('flowchart'),
    nodes: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        details: z.array(z.string()),
      })
    ),
    edges: z.array(
      z.object({
        from: z.string(),
        to: z.string(),
      })
    ),
  }).nullable().optional(),
});

module.exports = {
  productManagerSchema,
  systemArchitectSchema,
  uiDesignerSchema,
  backendEngineerSchema,
};
