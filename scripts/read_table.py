import pandas as pd

models:
  - title: Grok 4
    provider: openrouter
    model: x-ai/grok-4
    apiKey: sk-or-v1-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  # کلیدت از openrouter.ai

  - title: Grok 3
    provider: openrouter
    model: x-ai/grok-3
    apiKey: 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  # همون کلید بالا

df = pd.read_csv('table.csv')  # فرض بر این است که فایل در همین پوشه است
print(df.head())
