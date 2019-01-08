import { NgModule } from '@angular/core';
import { MaterialDesignModule } from 'app/shared/material-design.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SharedModule } from "app/shared/shared.module";
import { ServiceRoutingModule } from "app/service-request/service-routing.module";

import { ServiceComponent } from "app/service-request/service.component";
import { ServiceRequestListComponent } from "app/service-request/service-request-list/service-request-list.component";
import { NewBeneficiaryComponent } from "app/shared-components/newBeneficiary-component/newBeneficiary.component";
import { BeneficiaryListComponent } from "app/service-request/beneficiaryList/beneficiaryList.component";
import { ServiceRequestHeadComponent } from "app/service-request/service-request-header/online/service-request-header.component";
import { ServiceRequestBodyComponent } from "app/service-request/service-request-body/online/service-request-body.component";
import { ServiceRequestFooterComponent } from "app/service-request/service-request-footer/service-request-footer.component";
import { ServiceRequestOnlineComponent } from "app/service-request/service-request-create/online/online.component";
import { ChangeNameOnlineComponent } from "app/service-request/change-name/online/online.component";
import { DemoSanjeevComponent } from "app/service-request/DemoForSanjeev/demo-sanjeev.component";
import { DuplicateServiceRequestOnlineComponent } from "app/service-request/service-request-duplicate/online/online.component";
import { ServiceRequestPrintComponent } from "app/service-request/service-request-print/online/online.component";
import { ServiceRequestViewComponent } from "app/service-request/service-request-view/online/online.component";
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ChangeAddressOnlineComponent } from "app/service-request/change-address/online/online.component";
import { TermLifeInsuranceCancellationOnlineComponent } from 'app/service-request/term-life-insurance-cancellation/online/online.component';
import { ServiceRequestOfflineBodyComponent } from 'app/service-request/service-request-body/offline/service-request-offline-body.component';
import { DownloadFormComponent } from 'app/service-request/service-request-downloadform/downloadform.component';
import { ServiceRequestNameChangeOfflineComponent } from 'app/service-request/change-name/offline/offline.component';
import { ServiceRequestOfflineHeaderComponent } from 'app/service-request/service-request-header/offline/service-request-offline-header.component';
import { MailFaxInfoComponent } from 'app/service-request/service-request-mail-fax/mail-fax-info.component';
import { ServiceRequestAddressChangeOfflineComponent } from 'app/service-request/change-address/offline/offline.component';
import { ServiceRequestOfflineComponent } from 'app/service-request/service-request-create/offline/offline.component';
import { ServiceRequestSelectionComponent } from 'app/service-request/service-request-selection/service-request-selection.component';
import { ServiceRequestBeneficiaryChangeOfflineComponent } from 'app/service-request/change-beneficiary/offline/offline.component';
import { ServiceRequestDuplicateDownloadComponent } from 'app/service-request/service-request-duplicate/download/download.component';
import { ServiceRequestTermLifeInsuranceCancelDownloadComponent } from 'app/service-request/term-life-insurance-cancellation/download/download.component';
import { ServiceRequestLifeLoanOnlineComponent } from 'app/service-request/life-loan/online/online.component';
import { ServiceRequestAutomaticPremiumBankInformationDownloadComponent } from 'app/service-request/automatic-premium-bank-information/download/download.component';
import { ServiceRequestAutomaticPremiumBankInformationOnlineComponent } from 'app/service-request/automatic-premium-bank-information/online/online.component';
import { InterestCreditingReallocationComponent } from 'app/service-request/interest-crediting-reallocation/online/online.component';
import { InterestCreditingReallocationDownloadComponent } from 'app/service-request/interest-crediting-reallocation/download/download.component';
import { ServiceRequestLifeLoanDownloadComponent } from 'app/service-request/life-loan/download/download.component';
import { ServiceRequestChangePaymentModeDownloadComponent } from 'app/service-request/change-payment-mode/download/download.component';
import { ServiceRequestDisbursementLifeInsuranceDownloadComponent } from 'app/service-request/disbursement-life-insurance/download/download.component';
import { ServiceRequestChangePaymentModeOnlineComponent } from 'app/service-request/change-payment-mode/online/online.component';
import { ServiceRequestDisbursementLifeInsuranceOnlineComponent } from 'app/service-request/disbursement-life-insurance/online/online.component';

import { RequiredMinimumDistributionDownloadComponent } from 'app/service-request/required-minimum-distribution/download/download.component';
import { RequiredMinimumDistributionComponent } from 'app/service-request/required-minimum-distribution/online/online.component';
import { ServiceRequestQualifiedDisbursementAndSystematicWithdrawlDownloadComponent } from 'app/service-request/qualified-disbursment-and-systematic-withdrawl/download/download.component';
import { ServiceRequestQualifiedDisbursementSystematicWithdrawlOnlineComponent } from 'app/service-request/qualified-disbursment-and-systematic-withdrawl/online/online.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceRequestNonQualifiedDisbursementSystematicWithdrawlOnlineComponent } from 'app/service-request/non-qualified-disbursement-and-systematic-withdrawal/online/online.component';
import { ServiceRequestNonQualifiedDisbursementAndSystematicWithdrawlDownloadComponent } from 'app/service-request/non-qualified-disbursement-and-systematic-withdrawal/download/download.component';
import { ServiceRequestInterestCreditingReallocationFiaDownloadDownloadComponent } from 'app/service-request/interest-crediting-reallocation-fia/download/download.component';

@NgModule({
  
  imports: [
    CommonModule,
    SharedModule,
    MaterialDesignModule,
    ServiceRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PDFExportModule,
    NgbModule
  ],
  
  declarations: [
    ServiceComponent,
    ServiceRequestListComponent,
    ServiceRequestChangePaymentModeOnlineComponent,
    NewBeneficiaryComponent,
    BeneficiaryListComponent,
    ServiceRequestLifeLoanOnlineComponent,
    ServiceRequestLifeLoanDownloadComponent,
    ServiceRequestHeadComponent,
    ServiceRequestBodyComponent,
    ServiceRequestFooterComponent,    
    ServiceRequestOnlineComponent,
    ChangeNameOnlineComponent,
    DemoSanjeevComponent,
    DuplicateServiceRequestOnlineComponent,
    ServiceRequestQualifiedDisbursementSystematicWithdrawlOnlineComponent,
    ServiceRequestNonQualifiedDisbursementSystematicWithdrawlOnlineComponent,    
    ServiceRequestPrintComponent,
    ServiceRequestViewComponent,
    ChangeAddressOnlineComponent,
    TermLifeInsuranceCancellationOnlineComponent,
    DownloadFormComponent,
    ServiceRequestOfflineBodyComponent,
    ServiceRequestNameChangeOfflineComponent,
    ServiceRequestOfflineHeaderComponent,
    ServiceRequestAddressChangeOfflineComponent,
    ServiceRequestBeneficiaryChangeOfflineComponent,
    MailFaxInfoComponent,
    ServiceRequestTermLifeInsuranceCancelDownloadComponent,
    ServiceRequestOfflineComponent,
    ServiceRequestSelectionComponent,    
    ServiceRequestDuplicateDownloadComponent,
    ServiceRequestAutomaticPremiumBankInformationDownloadComponent,
    ServiceRequestQualifiedDisbursementAndSystematicWithdrawlDownloadComponent,
    ServiceRequestNonQualifiedDisbursementAndSystematicWithdrawlDownloadComponent,
    ServiceRequestAutomaticPremiumBankInformationOnlineComponent,  
    ServiceRequestLifeLoanDownloadComponent,
    ServiceRequestChangePaymentModeDownloadComponent,
    ServiceRequestDisbursementLifeInsuranceDownloadComponent,
    InterestCreditingReallocationComponent,
    InterestCreditingReallocationDownloadComponent,
    ServiceRequestDisbursementLifeInsuranceOnlineComponent,    
    RequiredMinimumDistributionComponent,
    RequiredMinimumDistributionDownloadComponent,
    ServiceRequestInterestCreditingReallocationFiaDownloadDownloadComponent
  ],
})

export class ServiceModule { }
