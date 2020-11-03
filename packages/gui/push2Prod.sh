# DESTDIR="/var/www/vsr"
DESTDIR="/var/www/vsr"
cp -rpvR dist/* ${DESTDIR}
cd ${DESTDIR}
chmod 555 index.html
chmod 555 static -R
systemctl restart httpd