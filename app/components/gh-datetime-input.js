import Ember from 'ember';
import boundOneWay from 'ghost-admin/utils/bound-one-way';
import {formatDate} from 'ghost-admin/utils/date-formatting';
import {InvokeActionMixin} from 'ember-invoke-action';

const {
    Component,
    RSVP,
    inject: {service}
} = Ember;

export default Component.extend(InvokeActionMixin, {
    tagName: 'span',
    classNames: 'input-icon icon-calendar',

    datetime: boundOneWay('value'),
    inputClass: null,
    inputId: null,
    inputName: null,
    timeZone: service(),

    didReceiveAttrs() {
        let promises = {
            datetime: RSVP.resolve(this.get('datetime') || moment.utc()),
            blogTimezone: RSVP.resolve(this.get('timeZone.blogTimezone'))
        };

        if (!this.get('update')) {
            throw new Error(`You must provide an \`update\` action to \`{{${this.templateName}}}\`.`);
        }

        RSVP.hash(promises).then((hash) => {
            this.set('datetime', formatDate(hash.datetime || moment.utc(), hash.blogTimezone));
        });
    },

    focusOut() {
        let datetime = this.get('datetime');

        this.invokeAction('update', datetime);
    }
});
