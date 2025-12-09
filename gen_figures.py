import matplotlib.pyplot as plt
import numpy as np

# Set publication style
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.size'] = 10
plt.rcParams['figure.dpi'] = 300

# Data from your tests (HOME page - complex scenario)
strategies = ['SSR', 'CSR', 'SSG', 'ISR']
ttfb = [148, 1, 6, 6]
lcp = [1133, 2559, 959, 964]
tbt = [1537, 1011, 2127, 2044]

# K6 Load test data
throughput = [56.89, None, None, 76.03]  # Only SSR and ISR tested
response_time = [346, None, None, 3.6]

colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12']

# Figure 1: Performance Trilemma (3-metric comparison)
fig, ax = plt.subplots(figsize=(8, 5))

x = np.arange(len(strategies))
width = 0.25

bars1 = ax.bar(x - width, ttfb, width, label='TTFB (ms)', color=colors[0], alpha=0.8)
bars2 = ax.bar(x, [l/10 for l in lcp], width, label='LCP (ms) ÷10', color=colors[1], alpha=0.8)
bars3 = ax.bar(x + width, [t/10 for t in tbt], width, label='TBT (ms) ÷10', color=colors[2], alpha=0.8)

ax.set_xlabel('Rendering Strategy', fontweight='bold')
ax.set_ylabel('Time (milliseconds)', fontweight='bold')
ax.set_title('', fontweight='bold')
ax.set_xticks(x)
ax.set_xticklabels(strategies)
ax.legend(loc='upper right')
ax.grid(axis='y', alpha=0.3, linestyle='--')

# Add value labels on bars
def autolabel(bars, scale=1):
    for bar in bars:
        height = bar.get_height()
        if height > 0:
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(height*scale)}',
                   ha='center', va='bottom', fontsize=8)

autolabel(bars1, 1)
autolabel(bars2, 10)
autolabel(bars3, 10)

plt.tight_layout()
plt.savefig('figure1_trilemma.png', dpi=300, bbox_inches='tight')
print("✅ Created: figure1_trilemma.png")

# Figure 2: Load Testing Comparison (SSR vs ISR)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

# Throughput comparison
strategies_load = ['SSR', 'ISR']
throughput_values = [56.89, 76.03]
bars = ax1.bar(strategies_load, throughput_values, color=[colors[0], colors[3]], alpha=0.8, width=0.6)
ax1.set_ylabel('Requests per Second', fontweight='bold')
ax1.set_title('Throughput Under Load\n(200 Concurrent Users)', fontweight='bold')
ax1.grid(axis='y', alpha=0.3, linestyle='--')
ax1.set_ylim([0, 85])

# Add percentage improvement annotation
improvement = ((76.03 - 56.89) / 56.89) * 100
ax1.annotate(f'+{improvement:.0f}%', xy=(1, 76.03), xytext=(1, 82),
            ha='center', fontsize=11, fontweight='bold', color=colors[3],
            arrowprops=dict(arrowstyle='->', color=colors[3], lw=2))

for i, bar in enumerate(bars):
    height = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2., height,
            f'{height:.1f}',
            ha='center', va='bottom', fontsize=9, fontweight='bold')

# Response time comparison (log scale)
response_values = [346, 3.6]
bars = ax2.bar(strategies_load, response_values, color=[colors[0], colors[3]], alpha=0.8, width=0.6)
ax2.set_ylabel('Average Response Time (ms)', fontweight='bold')
ax2.set_title('Response Time Under Load\n(200 Concurrent Users)', fontweight='bold')
ax2.set_yscale('log')
ax2.grid(axis='y', alpha=0.3, linestyle='--', which='both')

# Add percentage annotation
reduction = ((346 - 3.6) / 346) * 100
ax2.annotate(f'-{reduction:.0f}%', xy=(1, 3.6), xytext=(1, 1.5),
            ha='center', fontsize=11, fontweight='bold', color=colors[3],
            arrowprops=dict(arrowstyle='->', color=colors[3], lw=2))

for i, bar in enumerate(bars):
    height = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2., height * 1.3,
            f'{height:.1f}',
            ha='center', va='bottom', fontsize=9, fontweight='bold')

plt.tight_layout()
plt.savefig('figure2_load_testing.png', dpi=300, bbox_inches='tight')
print("✅ Created: figure2_load_testing.png")

# Figure 3: Hydration Tax (Bundle Size vs TBT)
fig, ax = plt.subplots(figsize=(8, 5))

bundle_sizes = [821, 821, 821, 821]  # All identical
tbt_values = [1537, 1011, 2127, 2044]

scatter = ax.scatter(bundle_sizes, tbt_values, s=300, c=colors, alpha=0.7, edgecolors='black', linewidth=2)

# Add labels for each point
for i, strategy in enumerate(strategies):
    ax.annotate(strategy, (bundle_sizes[i], tbt_values[i]), 
               xytext=(10, 10), textcoords='offset points',
               fontsize=11, fontweight='bold',
               bbox=dict(boxstyle='round,pad=0.5', facecolor=colors[i], alpha=0.3))

ax.set_xlabel('JavaScript Bundle Size (KB)', fontweight='bold')
ax.set_ylabel('Total Blocking Time (ms)', fontweight='bold')
ax.set_title('The Hydration Tax: Bundle Size vs TBT\n(Identical Bundles, Different Execution Costs)', fontweight='bold')
ax.grid(True, alpha=0.3, linestyle='--')
ax.set_xlim([800, 842])

# Add annotation explaining the finding
ax.text(821, 2300, 'All strategies ship 821KB\nbut TBT varies 2×\n→ Execution-time problem,\n   not payload problem',
       ha='center', fontsize=9, style='italic',
       bbox=dict(boxstyle='round,pad=0.8', facecolor='yellow', alpha=0.3))

plt.tight_layout()
plt.savefig('figure3_hydration_tax.png', dpi=300, bbox_inches='tight')
print("✅ Created: figure3_hydration_tax.png")

print("\n📊 All figures created successfully!")
print("   - figure1_trilemma.png (TTFB vs LCP vs TBT)")
print("   - figure2_load_testing.png (SSR vs ISR under load)")
print("   - figure3_hydration_tax.png (Bundle size vs TBT)")
