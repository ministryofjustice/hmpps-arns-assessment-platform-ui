import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Privacy policy for Assess and plan – sentence plan</h1>',
})

export const pageContent = HtmlBlock({
  content: `
    <p class="govuk-body">Last reviewed: 8 April 2026</p>
    <p class="govuk-body">Assess and plan is provided by Justice Digital, part of the Ministry of Justice (MOJ).</p>
    <p class="govuk-body">The MOJ is the data controller. A data controller determines how and why personal data is processed.</p>
    <p class="govuk-body">The MOJ is committed to the protection and security of your personal information.
        It is important that you read this notice so that you are aware of how and why we are using such information.
        This privacy policy describes how we collect and use personal information during and after your relationship with us,
        in accordance with data protection law. It will be updated regularly.</p>

    <h2 class="govuk-heading-m">About personal information</h2>
    <p class="govuk-body">This privacy policy sets out the standards that you can expect from the MOJ when we request or
        hold personal information ('personal data') about you; how you can get access to a copy of your personal data;
        and what you can do if you think the standards are not being met.</p>
    <p class="govuk-body">Personal data is information about you as an individual. It can be your name and email address.</p>
    <p class="govuk-body">We know how important it is to protect your privacy and to comply with data protection laws.
        We will safeguard your personal data and will only disclose it where it is lawful to do so, or with your consent.</p>

    <h2 class="govuk-heading-m">What data we collect</h2>
    <p class="govuk-body">The personal data we collect from you includes:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>your username, password, name and email address</li>
        <li>your Internet Protocol (IP) address, and details of which version of web browser you used</li>
        <li>information on how you use the site, using cookies, page tagging techniques, monitoring and logging, and auditing services</li>
    </ul>
    <p class="govuk-body">We use Application Insights software to collect information about how you use Assess and plan.
        This includes IP addresses. The data is anonymised before being used for analytics processing. </p>
    <p class="govuk-body">Application Insights processes anonymised information about:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>the pages you visit</li>
        <li>how long you spend on each page</li>
        <li>how you got to the service</li>
        <li>what you click on while you’re visiting the service</li>
    </ul>
    <p class="govuk-body">We do not store your personal information (for example, your name or address) through Application Insights.</p>
    <p class="govuk-body">We will not identify you through analytics information,
        and we will not combine analytics information with other data sets in a way that would identify who you are.</p>
    <p class="govuk-body">We use an internal auditing service to ensure that your use of the service is in line with Information Security policies,
        and to aid investigations into potential breaches. This service records what pages you view, and the actions you perform while using Assess and plan.</p>
    <p class="govuk-body">We use monitoring and logging services to ensure the technical performance of the service is adequate.
        These services record which parts of Assess and plan you access.</p>
    <p class="govuk-body">We continuously test and monitor our data protection controls to make sure they're effective and to detect any weaknesses.</p>

    <h2 class="govuk-heading-m">Why we need your data</h2>
    <p class="govuk-body">We collect information through Application Insights to see how you use the service. We do this to help:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>make sure the service is meeting the needs of its users</li>
        <li>make improvements, for example improving site search</li>
    </ul>
    <p class="govuk-body">We also collect data in order to:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>confirm you can lawfully access and alter data on the service</li>
        <li>confirm your use of the service is in line with information security policy</li>
        <li>gather feedback to improve our services</li>
        <li>respond to any feedback you send us, if you’ve asked us to</li>
        <li>monitor use of the site to identify security threats</li>
        <li>ensure the technical performance of the site is adequate</li>
    </ul>

    <h2 class="govuk-heading-m">Our legal basis for processing your data</h2>
    <p class="govuk-body">The legal basis for processing personal data in relation to site security is our legitimate interests,
        and the legitimate interests of our users, in ensuring the security and integrity of Assess and plan.</p>
    <p class="govuk-body">The legal basis for processing all other personal data is that it is collected to fulfil your obligations under your employment contract,
        and is necessary for the performance of a task in the public interest or in the exercise of official authority, as per HMPPS policies and procedures.</p>

    <h2 class="govuk-heading-m">What we do with your data</h2>
    <p class="govuk-body">We will not:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>sell or rent your data to third parties</li>
        <li>share your data with third parties for marketing purposes</li>
        <li>use your data in analytics</li>
    </ul>
    <p class="govuk-body">We will share your data if we are required to do so by law – for example, by court order, or to prevent fraud or other crime.</p>

    <h2 class="govuk-heading-m">Comments and feedback</h2>
    <p class="govuk-body">If you comment or give feedback, we use your email data to check you are authorised to use Assess and plan.</p>

    <h2 class="govuk-heading-m">How long we keep your data</h2>
    <p class="govuk-body">We will only retain your personal data for as long as:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>it is needed for the purposes set out in this document</li>
        <li>the law requires us to</li>
    </ul>

    <h2 class="govuk-heading-m">Where your data is processed and stored</h2>
    <p class="govuk-body">We design, build and run our systems to make sure that your data is as safe as possible at all stages,
        both while it's processed and when it's stored.</p>
    <p class="govuk-body">All personal data is stored in the European Economic Area (EEA).
        Data collected by Application Insights may be transferred outside the EEA for processing.</p>

    <h2 class="govuk-heading-m">How we protect your data and keep it secure</h2>
    <p class="govuk-body">We are committed to doing all that we can to keep your data secure. We have set up systems and
        processes to prevent unauthorised access or disclosure of your data – for example, we protect your data using varying levels of encryption.</p>
    <p class="govuk-body">We also make sure that any third parties that we deal with keep all personal data they process on our behalf secure.</p>

    <h2 class="govuk-heading-m">Further information</h2>
    <p class="govuk-body">You can get more details on:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>agreements we have with other organisations for sharing information</li>
        <li>circumstances where we can pass on personal information without telling you, for example, to help with the
            prevention or detection of crime or to produce anonymised statistics</li>
        <li>our instructions to staff on how to collect, use or delete your personal information</li>
        <li>how we check that the information we hold is accurate and up-to-date, and</li>
        <li>how to make a complaint</li>
    </ul>
    <p class="govuk-body">For more information about the above issues, please contact the MOJ data protection officer:</p>
    <p class="govuk-body">
        MOJ Data Protection Officer<br>
        3rd Floor, Post Point 3.20<br>
        10 South Colonnades<br>
        London<br>
        E14 4PU<br>
    </p>
    <p class="govuk-body">You can email our Data Protection team at: DataProtection@justice.gov.uk</p>

    <h2 class="govuk-heading-m">Your rights</h2>
    <p class="govuk-body">You have the right to request:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>information about how your personal data is processed</li>
        <li>a copy of that personal data</li>
        <li>that anything inaccurate in your personal data is corrected immediately</li>
    </ul>
    <p class="govuk-body">You can also:</p>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-left-4">
        <li>raise an objection about how your personal data is processed</li>
        <li>request that your personal data is erased if there is no longer a justification for it</li>
        <li>ask that the processing of your personal data is restricted in certain circumstances</li>
    </ul>
    <p class="govuk-body">For more information on your rights and how to complain, see the MOJ personal information charter.</p>
    <p class="govuk-body">You can contact our Data Protection team at:</p>
    <p class="govuk-body">
        Data Protection Team<br>
        5.18, 5th Floor<br>
        102 Petty France<br>
        Westminster<br>
        London<br>
        SW1H 9AJ<br>
    </p>
    <p class="govuk-body">You can email our Data Protection team at: DataProtection@justice.gov.uk</p>

    <h2 class="govuk-heading-m">Changes to this policy</h2>
    <p class="govuk-body">We may change this privacy policy. In that case, the 'Last reviewed' date on this page will also change.
        Any changes to this privacy policy will apply to you and your data immediately.</p>
    <p class="govuk-body">If these changes affect how your personal data is processed, the MOJ will take reasonable steps to let you know.</p>
  `,
})
