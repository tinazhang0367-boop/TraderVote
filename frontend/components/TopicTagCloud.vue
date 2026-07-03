<template>
  <div class="topic-cloud">
    <button
      v-for="topic in topics"
      :key="topic.key"
      type="button"
      :class="['topic-cloud__pill', `topic-cloud__pill--${topic.sentiment}`, { 'topic-cloud__pill--active': isActive(topic) }]"
      @click="toggle(topic)"
    >
      <span class="topic-cloud__icon">{{ iconFor(topic.sentiment) }}</span>
      <span class="topic-cloud__label">{{ labelFor(topic) }}</span>
      <span class="topic-cloud__count">{{ topic.count }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TopicInsight } from '~/types/broker'

const props = withDefaults(defineProps<{
  topics: TopicInsight[]
  /** Keys currently selected; toggling adds/removes from the Set */
  selected?: string[]
}>(), {
  selected: () => [],
})

const emit = defineEmits<{
  (e: 'toggle', topic: TopicInsight): void
}>()

const { t } = useI18n()

function labelFor(topic: TopicInsight): string {
  // Prefer pre-translated `label` from data; fall back to i18n key by topic.key
  return topic.label || t(`topics.${topic.key}` as any, { default: topic.key })
}

function iconFor(sentiment: TopicInsight['sentiment']): string {
  return sentiment === 'positive' ? '👍' : sentiment === 'negative' ? '⚠️' : '•'
}

function isActive(topic: TopicInsight): boolean {
  return props.selected.includes(topic.key)
}

function toggle(topic: TopicInsight) {
  emit('toggle', topic)
}
</script>

<style scoped>
.topic-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.topic-cloud__pill {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out);
}

.topic-cloud__pill:hover {
  border-color: var(--color-text-3);
  background: var(--color-bg-muted);
}

.topic-cloud__pill--positive { color: var(--sentiment-positive); border-color: var(--score-excellent-bg); background: var(--score-excellent-bg); }
.topic-cloud__pill--negative { color: var(--score-bad);         border-color: var(--score-bad-bg);       background: var(--score-bad-bg); }
.topic-cloud__pill--neutral  { color: var(--color-text-2);      border-color: var(--color-border);       background: var(--color-bg-muted); }

.topic-cloud__pill--active {
  border-color: currentColor;
  box-shadow: 0 0 0 2px currentColor inset;
}

.topic-cloud__icon { font-size: var(--text-sm); line-height: 1; }
.topic-cloud__label { color: var(--color-text-1); font-weight: 600; }
.topic-cloud__count {
  color: var(--color-text-3);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  font-size: var(--text-xs);
  padding-inline: 6px;
  border-radius: var(--radius-pill);
  background: rgba(0,0,0,.04);
}
</style>