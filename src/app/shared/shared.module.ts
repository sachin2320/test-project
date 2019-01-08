import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from "@angular/common";
import { MaterialDesignModule } from 'app/shared/material-design.module';

import { EChartsDirective } from './echarts.directive';
import { SlimScrollDirective } from './slim-scroll.directive';
import { ServiceListComponent } from "app/shared-components/serviceList-component/serviceList.component";
import { GridComponent } from "app/shared-components/grid-component/grid.component";
import { GridDynamicComponent } from "app/shared-components/grid-dynamic-component/grid.dynamic.component";
import { FileUploadComponent } from "app/shared-components/fileUpload-component/file-upload.component";
import { LogoComponent } from "app/shared-components/logo-component/logo.component";
import { NumericInputDirective } from 'app/shared/numericInput.directive';
import { DecimalInputDirective } from 'app/shared/decimalInput.directive';
import { AlphaWithSpecialCharInputDirective } from 'app/shared/alphaWithSpecialCharInput.directive';
import { NumericWithSpecialCharInputDirective } from 'app/shared/numericWithSpecialCharInput.directive';
import { FglSensitiveInputDirective } from 'app/shared/fglSensitiveInput.directive';

import { RouterModule } from '@angular/router';
import { FglTooltipComponent } from 'app/shared-components/fgl-tooltip/fgl-tooltip.component';
import { FglMessageComponent } from 'app/shared-components/message-component/message.component';
import { DecimalPipe } from 'app/shared/decimal.pipe';
import { SortByPipe } from 'app/shared/sortBy.pipe';
import { NumberMaskingPipe } from 'app/shared/number.masking.pipe';
import { FullNumberMaskingPipe } from 'app/shared/full.number.masking.pipe';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FglSsnInputDirective } from 'app/shared/fglSsnInput.directive';
import { FglTooltipDynamicComponent } from 'app/shared-components/fgl-tooltip-dynamic/fgl-tooltip-dynamic.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialDesignModule,
        NgbModule
    ],
    declarations: [
        EChartsDirective,
        SlimScrollDirective,
        ServiceListComponent,
        GridComponent,
        GridDynamicComponent,
        FileUploadComponent,
        LogoComponent,
        NumericInputDirective,
        DecimalInputDirective,
        AlphaWithSpecialCharInputDirective,
        NumericWithSpecialCharInputDirective,
        FglSensitiveInputDirective,
        FglMessageComponent,
        FglTooltipComponent,
        FglTooltipDynamicComponent,
        DecimalPipe,
        SortByPipe,
        NumberMaskingPipe,
        FullNumberMaskingPipe,
        FglSsnInputDirective
    ],
    providers: [
        PercentPipe,
        CurrencyPipe,
        DatePipe,
        DecimalPipe,
        SortByPipe,
        NumberMaskingPipe,
        FullNumberMaskingPipe
    ],
    exports: [
        EChartsDirective,
        SlimScrollDirective,
        NumericInputDirective,
        ServiceListComponent,
        GridComponent,
        GridDynamicComponent,
        FileUploadComponent,
        LogoComponent, 
        NumericInputDirective,
        DecimalInputDirective,
        AlphaWithSpecialCharInputDirective,
        NumericWithSpecialCharInputDirective,
        FglSensitiveInputDirective,
        FglMessageComponent,
        FglTooltipComponent,
        FglTooltipDynamicComponent,
        DecimalPipe,
        SortByPipe,
        NumberMaskingPipe,
        FullNumberMaskingPipe,
        FglSsnInputDirective
    ]
})

export class SharedModule { }


