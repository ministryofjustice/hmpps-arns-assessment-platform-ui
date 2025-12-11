import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { block, Data, field, Format, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { squadOptions } from '../../options'

export const squadScripts = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<style nonce="%1">
      .koala-rain {
        position: fixed;
        top: -6rem;
        font-size: 6rem;
        pointer-events: none;
        z-index: 9999;
        animation: koala-fall 4s linear forwards;
      }
      @keyframes koala-fall {
        0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(200vh) rotate(calc(var(--spin) * 360deg)); opacity: 0; }
      }
    </style>
    <script nonce="%1">
      document.addEventListener('DOMContentLoaded', function() {
        const squadEffects = {
          'squad-1': '👻',
          'phoenix': '🔥',
          'hippo': '🦛',
          'koala': '🐨'
        };

        Object.entries(squadEffects).forEach(function([value, emoji]) {
          const radio = document.querySelector('input[value="' + value + '"]');
          if (radio) {
            radio.addEventListener('change', function() {
              for (let i = 0; i < 30; i++) {
                setTimeout(function() {
                  const el = document.createElement('div');
                  el.className = 'koala-rain';
                  el.textContent = emoji;
                  el.style.left = Math.random() * 100 + 'vw';
                  el.style.animationDuration = (2 + Math.random() * 2) + 's';
                  el.style.setProperty('--spin', Math.random() > 0.5 ? '1' : '-1');
                  document.body.appendChild(el);
                  setTimeout(function() { el.remove(); }, 4000);
                }, i * 100);
              }
            });
          }
        });
      });
    </script>`,
    Data('cspNonce'),
  ),
})

export const squadSelection = field<GovUKRadioInput>({
  code: 'targetSquad',
  variant: 'govukRadioInput',
  label: 'Who is this update for?',
  hint: 'Select your audience',
  items: squadOptions,
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select which squad you are updating',
    }),
  ],
})

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Continue',
  name: 'action',
  value: 'continue',
})
