import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { block, Data, Format } from '@form-engine/form/builders'

export const wrongSquadContent = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<style nonce="%1">
      .bouncy-smiley {
        position: fixed;
        font-size: 15rem;
        z-index: 9999;
        pointer-events: none;
      }
    </style>
    <h1 class="govuk-heading-xl">WHY DID YOU GO HERE?!</h1>
    <p class="govuk-body-l">This squad doesn't have any updates. Enjoy the smiley.</p>
    <script nonce="%1">
      document.addEventListener('DOMContentLoaded', function() {
        const smiley = document.createElement('div');
        smiley.className = 'bouncy-smiley';
        smiley.textContent = '😀';
        document.body.appendChild(smiley);

        let x = 0, y = 0;
        let dx = 4, dy = 3;
        const size = 240;

        function animate() {
          const maxX = window.innerWidth - size;
          const maxY = window.innerHeight - size;

          x += dx;
          y += dy;

          if (x <= 0) { x = 0; dx = -dx; }
          if (x >= maxX) { x = maxX; dx = -dx; }
          if (y <= -30) { y = -30; dy = -dy; }
          if (y >= maxY) { y = maxY; dy = -dy; }

          smiley.style.left = x + 'px';
          smiley.style.top = y + 'px';

          requestAnimationFrame(animate);
        }

        animate();
      });
    </script>`,
    Data('cspNonce'),
  ),
})

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Get me out of here',
  name: 'action',
  value: 'continue',
})
